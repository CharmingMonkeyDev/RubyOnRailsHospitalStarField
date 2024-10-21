# frozen_string_literal: true

class User < ApplicationRecord
  acts_as_paranoid
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable,
         :timeoutable, :lockable

  enum role: %i[patient pharmacist physician health_coach]

  # for provider, the invitaton type is other
  # for manually added user it is not_invited
  enum user_creation_type: {
    "invited": "invited",
    "not_invited": "not_invited",
    "invitation_pending": "invitation_pending",
    "other": "other"
  }

  # callbacks
  # link with NDIIS is created from process_patient_creation.rb
  before_create :generate_mrn_number
  before_save :lower_case_email
  after_create :link_patient_with_ndhin
  before_destroy :unassign_related_resources

  # Validations
  required_columns = %i[
    email first_name last_name
  ]
  validates_presence_of required_columns
  validates :email, uniqueness: { case_sensitive: false }

  # associations
  has_many :chat_channels, dependent: :destroy
  has_many :chat_channel_users, dependent: :destroy
  has_many :patient_medications, dependent: :destroy
  has_one :patient_device, dependent: :destroy
  has_many :patient_device_readings, through: :patient_device, dependent: :destroy
  has_many :assigned_actions, dependent: :destroy
  has_many :assigned_pathways, dependent: :destroy
  has_many :assigned_pathway_weeks, through: :assigned_pathways, dependent: :destroy
  has_many :assigned_pathway_week_actions, through: :assigned_pathway_weeks, dependent: :destroy
  has_many :provider_assigned_pathway_week_actions, class_name: "AssignedPathwayWeekAction", foreign_key: "assigned_coach_id", dependent: :destroy, dependent: :destroy
  has_many :blood_pressure_readings, dependent: :destroy
  has_many :weight_readings, dependent: :destroy
  has_many :customer_users, dependent: :destroy
  has_many :customers, through: :customer_users
  has_one :customer_selection, dependent: :destroy
  has_many :customer_user_privileges, through: :customer_users, dependent: :destroy
  has_many :privileges, through: :customer_user_privileges
  has_many :synced_accounts, dependent: :destroy
  has_many :glucose_readings, through: :synced_accounts, dependent: :destroy
  belongs_to :invited_by, class_name: "User", foreign_key: "invited_by_id", optional: true
  has_many :invited_to, class_name: "User", foreign_key: "invited_by_id"

  has_many :patient_insurances, dependent: :destroy

  has_many :adt_outbound_logs, dependent: :destroy
  has_many :adt_patient_notifications, dependent: :destroy
  has_many :encounter_billings, class_name: "EncounterBilling", foreign_key: "patient_id", dependent: :destroy
  has_many :provider_encounter_billings, class_name: "EncounterBilling", foreign_key: "created_by_id"
  has_many :notes_templates, dependent: :destroy
  has_one :follow_up_date, dependent: :destroy
  has_many :patient_lists, foreign_key: "owner_id", dependent: :destroy
  has_and_belongs_to_many :assigned_patient_lists, class_name: 'PatientList', join_table: 'patient_lists_users'
  has_many :patient_notes, dependent: :destroy
  has_one :patient_ndiis_account, dependent: :destroy
  has_many :patient_forecast_immunizations, dependent: :destroy
  has_many :patient_historical_immunizations, dependent: :destroy
  has_many :board_messages
  has_many :ambulatory_weekly_results, dependent: :destroy
  has_many :questionnaire_assignments, dependent: :destroy
  has_many :provider_questionnaire_assignments, class_name: "QuestionnaireAssignment", foreign_key: "provider_id"
  has_many :lab_readings, dependent: :destroy
  has_many :questionnaire_qrs, class_name: "QuestionnaireQr", foreign_key: "patient_id"
  has_many :assigned_questionnaire_qrs, class_name: "QuestionnaireQr", foreign_key: "assigned_by_id"
  has_many :assigned_programs, foreign_key: "patient_id", dependent: :destroy
  has_many :programs, through: :assigned_programs

  has_many :assigned_provider_actions, foreign_key: "patient_id", dependent: :destroy
  has_many :assignment_histories, foreign_key: "patient_id", dependent: :destroy
  has_many :ltc_facility_assignments
  has_many :ltc_facilities, through: :ltc_facility_assignments, dependent: :destroy
  belongs_to :ltc_facility, optional: true
  has_many :diagnosis_assignments

  # query scopes
  scope :has_dexcom_association, -> { joins(:synced_accounts).where('synced_accounts.id is not null')}
  scope :care_plan_scope, -> { includes(:assigned_actions).includes(:assigned_pathways)}
  scope :active, -> { where(is_active: true) }

  def custom_json(type)
    case type
    when :care_plan_management
      self.as_json({include: [:assigned_actions, :assigned_pathways]})
    else
      self.as_json
    end
  end

  def serializable_hash(options = nil)
    super(options).merge(
      last_sign_in_at: last_sign_in_at,
      name: name,
      name_reversed: name_reversed,
      invitation_accepted: get_invitation_accepted,
      age: age,
      full_address: full_address,
      formatted_follow_up: get_formatted_follow_up,
      is_admin: is_admin?
    )
  end

  def unassign_related_resources
    self.provider_assigned_pathway_week_actions.each do |week_action|
      if week_action.due_date.nil? or week_action.due_date > Time.now
        week_action.update(assigned_coach_id: nil, status: :unassigned)
      end
    end
  end

  def is_patient?
    self.role == "patient"
  end

  def is_provider?
    self.role != "patient"
  end

  def is_admin?
    active_customer_ids = self.customer_users.where(status: "accepted").pluck(:customer_id)
    active_customer_names = Customer.where(id: active_customer_ids).pluck(:name)
    return active_customer_names.include?("Starfield Central") && self.is_provider?
  rescue StandardError => e
    return false
  end

  def name
    "#{self.first_name} #{self.middle_name} #{self.last_name}"
  end

  def name_reversed
    "#{self.last_name}, #{self.first_name} #{self.middle_name}"
  end

  def age
    if self.date_of_birth.present?
      now = Time.now
      dob = self.date_of_birth
      age =  now.year - dob.year - ((now.month > dob.month || (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
      "#{age} yrs"
    else
      ""
    end
  end

  def full_address
    # there was empty coma when address is not present so this check added
    if self.address.present? && self.city.present?
      "#{self.address}, #{self.city}, #{self.state} #{self.zip}"
    else
      ""
    end
  end

  def formatted_date_of_birth
    self.date_of_birth&.strftime("%m/%d/%Y")
  end

  def js_formatted_dob
    # other date format throws one off on JS conversion so we use this format so it stays the same on patient edit
    self.date_of_birth&.strftime("%m-%d-%Y")
  end

  def get_invitation_accepted
    return self.invitation_accepted?
  end

  def get_action_categories
    ActionCategory.left_outer_joins(:patient_actions)
                  .where("patient_actions.customer_id = #{self.customer_selection.customer_id}")
                  .select('action_categories.name, action_categories.id as category_id, patient_actions.*')
  end

  def get_category_options
    category_options = []
    categories = ActionCategory.all
    categories.each do |category|
      category_array = []
      category_array[0] = category.name
      category_array[1] = category.id
      category_options << category_array
    end
    return category_options
  end

  def get_action_groups
    PatientActionGroup.where(customer_id: customer_selection.customer.id)
  end

  def active_for_authentication?
    super && is_active
  end

  def inactive_message
    'Sorry, this account is inactive.'
  end

  def after_database_authentication
    if ENV["TWO_FACTOR_INTEGRATED"] == "true"
      send_2fa_code
    else
      self_verify_2fa
    end
  end

  def get_user_privileges
    selected_customer = self.customer_selection.customer
    customer_user_privileges = CustomerUser.where(user: self, customer: selected_customer).first.customer_user_privileges.joins(:privilege)
    privileges = []
    customer_user_privileges.each do |customer_user_privilege|
      privilege_obj = {}
      privilege_obj["id"] = customer_user_privilege.id
      privilege_obj["customer_user_id"] = customer_user_privilege.customer_user_id
      privilege_obj["privilege_id"] = customer_user_privilege.privilege_id
      privilege_obj["privilege_state"] = customer_user_privilege.privilege_state
      privilege_obj["name"] = customer_user_privilege.privilege.name
      privilege_obj["description"] = customer_user_privilege.privilege.description
      privileges << privilege_obj
    end
    return privileges
  end

  def get_adt_disabled_minutes
    modified_time =  self.adt_notif_modified_at
    if modified_time
      time_diff = ((modified_time + ENV["ADT_NOTIF_DELAY_MIN"].to_i.minutes).to_i - Time.now.to_i) / 1.minutes

      if time_diff.positive?
        time_diff
      else
        0
      end
    else
      0
    end
  end

  def get_associated_customer_name
    Customer.joins(:customer_users).where("customer_users.user_id = ? and status != ?",self.id, 'inactive')&.pluck(:name)&.uniq&.join(", ")
  end

  def get_patients
    return User.where(id: self.id) if self.is_patient?
    customers = self.customers
    if customers.present?
      actively_assigned_user_ids =  customers.map{|c| c.customer_users.active_or_pending.pluck(:user_id)}.flatten.uniq
      patients = User.where(id: actively_assigned_user_ids,role: "patient").order(:last_name)
      patients
    else
      User.where("1=2") #empty association
    end
  end

  def patient_insurance
    patient_insurances.where(is_secondary: false).first
  end

  def secondary_patient_insurance
    patient_insurances.where(is_secondary: true).first
  end

  def assigned_facility
    ltc_facility_assignments.joins(:ltc_facility).find_by(active: true)&.ltc_facility
  end

  def assigned_diagnoses
    diagnosis_assignments.where(active: true)
                         .order(created_at: :asc)
                         .uniq
  end

  def cgm_present?
    glucose_readings.exists?
  end

  def program_titles
    assigned_programs.map { |ap| ap.program.title }.uniq
  end

  def diagnosis_code_values
    diagnosis_assignments.map(&:diagnosis_code_value).uniq
  end

  def insurance_types_list
    patient_insurances.map(&:insurance_type).uniq
  end

  def ltc_facility_names
    ltc_facilities.map(&:name).uniq
  end

  private

  def send_2fa_code
    two_factor_code = generate_two_factor_code
    self.two_factor_verification_code= two_factor_code,
    self.two_factor_code_sent_at= Time.now,
    self.two_factor_auth_attempts= 0,
    self.two_factor_verified_at= nil
    self.save(validate: false)
    message = "Your Starfield code is: #{two_factor_code}"
    # this model will sanitize the phone number too, expecting XXX-XXX-XXXX format
    TextSms.new(self.mobile_phone_number, message).send
  end

  def self_verify_2fa
    two_factor_code = generate_two_factor_code
    self.two_factor_verification_code= two_factor_code,
    self.two_factor_code_sent_at= Time.now,
    self.two_factor_auth_attempts= 0,
    self.two_factor_verified_at= Time.now
    self.save(validate: false)
  end

  def lower_case_email
    self.email = self.email&.downcase
  end

  def generate_two_factor_code
    code = rand.to_s[2..6]
    return code
  end

  def generate_mrn_number
    if self.role == "patient"
      self.mrn_number = get_mrn_number
    end
  end

  def get_mrn_number
    if Rails.env.test?
      return rand.to_s[2..6]
    end
    sql = "SELECT nextval('users_mrn_id_seq');"
    records_array = ActiveRecord::Base.connection.execute(sql)
    records_array.first["nextval"]
  end

  def link_patient_with_ndhin
    if self.role == "patient"
      # adding into queue and will be processed from process_sqs_message_read.rb
      ProcessSqsMessageCreation.new({service_name: "LinkPatientWithNDHIN", user_id: self.id}).call
    end
  end

  def get_formatted_follow_up
    self.follow_up_date&.next_date&.strftime("%m/%d/%Y")
  end

end
