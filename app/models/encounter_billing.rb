class EncounterBilling < ApplicationRecord

    belongs_to :patient, class_name: "User", foreign_key: "patient_id"
    belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true
    belongs_to :customer, optional: true
    has_many :encounter_notes, dependent: :destroy
    has_one :patient_instruction, dependent: :destroy
    has_many :encounter_billing_loggers, dependent: :destroy
    has_many :encounter_claim_informations, dependent: :destroy
    has_one :encounter_insurance_information, dependent: :destroy
    has_one :encounter1500_information, dependent: :destroy
    has_many :eb_send_charges_logs, dependent: :destroy

    # callbacks
    before_create :set_transaction_and_interchange_number
    after_commit :reload_uuid, on: :create
    before_destroy :validate_status

    # enums
    enum encounter_type: {
        "med_administration": "med_administration",
        "office_visit": "office_visit",
        "telehealth_visit": "telehealth_visit",
        "documentation": "documentation",
        "phone_call": "phone_call"
    }

    enum status: {
        "pended": "pended",
        "signed": "signed",
        "charged": "charged"
    } 

    def serializable_hash(options = nil)
        super(options).merge(
            formatted_date: formatted_date, 
            formatted_time: formatted_time,
            formatted_notes: formatted_notes
        )
    end

    def formatted_notes
        self.encounter_notes.where(addendum:false)&.pluck(:notes)&.join("\n")
    end
    
    def regular_notes
      self.encounter_notes.where(addendum:false)
    end 

    def notes_json 
      self.regular_notes.map{|e| e.json}
    end

    def formatted_addendums
      users = User.where(id: self.addendums.pluck(:creator_id)) 
      self.addendums.map do |addendum|   
        user = users.select{|user| user.id == addendum.creator_id}.first
        next unless user
        attribution = "#{addendum.created_at.strftime('%m/%d/%Y')} - #{user.name}, #{user.role.capitalize}\n\n" 
        attribution + addendum.notes + "\n\n"
      end
    end 
      
    def addendums 
      self.encounter_notes.where(addendum:true)
    end 

    private

    def reload_uuid
        # not loading uuid was intended rails behaviour https://github.com/rails/rails/issues/17605

        if self.attributes.has_key? 'uuid'
            self[:uuid] = self.class.where(id: id).pluck(:uuid).first
        end
    end

    def formatted_date
        self.day_of_encounter&.strftime("%m/%d/%Y")
    end

    def formatted_time
        self.created_at&.strftime("%I:%M %P")
    end

    def set_transaction_and_interchange_number
        self.interchange_number = get_interchange_number
        self.transaction_set_number = get_transaction_set_number
    end

    def get_interchange_number
        loop do
            token = SecureRandom.random_number(10000000)
            break token unless EncounterBilling.where(interchange_number: token).exists?
        end
    end

    def get_transaction_set_number
        loop do
            token = SecureRandom.random_number(10000000)
            break token unless EncounterBilling.where(transaction_set_number: token).exists?
        end
    end
    
    def validate_status
        return if self.status == "pended"
        errors[:base] << 'Billing cannot be deleted if is signed or charged'
        throw :abort
    end
end