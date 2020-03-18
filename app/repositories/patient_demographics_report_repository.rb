class PatientDemographicsReportRepository
  include GeneralHelper

  def initialize(attributes)
    @attributes = attributes
    @provider_id = @attributes[:provider_id]
    @customer_id = @attributes[:customer_id]
    @insurance_type = @attributes[:insurance_type]
    @linked_to_iis = @attributes[:linked_to_iis]
    @linked_to_hie = @attributes[:linked_to_hie]
    @admin_report = @attributes[:admin_report]
  end

  def get_data
    result = get_aggregate_data
  end

  private 

  attr_accessor :provider_id, :customer_id, :insurance_type, :linked_to_iis, :linked_to_hie

  def provider
      @provider ||= User.find(provider_id)
  end

  def get_aggregate_data
    all_data = get_all_data
    array_data = all_data.to_a
    array_data
  end

  def get_filters
      filter = ""
      if customer_id.present?
        filter += " and c.id = #{customer_id}"
      end

      if insurance_type.present?
        filter += " and lower(pi.insurance_type) = '#{insurance_type.downcase}'"
      end

      if linked_to_iis.present?
        if linked_to_iis == "yes"
          filter += " and pna.user_id is not null"
        else
          filter += " and pna.user_id is null"
        end
      end

      if linked_to_hie.present?
        if linked_to_hie == "yes"
          filter += " and patient_identifier is not null"
        else
          filter += " and patient_identifier is null"
        end
      end

      return filter
  end

  def customer_ids
    if @admin_report
      customer_ids = Customer.all.pluck(:id)
    else
      customers = provider.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
      customer_ids = customers.ids
    end

    customer_ids
  end

  def get_all_data
    sql = "select  c.id as c_id, c.name, c.county as customer_county, patient.id as id, patient.first_name, 
            patient.last_name, patient.middle_name, patient.date_of_birth,
            patient.gender, patient.mrn_number, patient.address, 
            patient.city, patient.state, patient.zip, patient.county, 
            patient.race, patient.ethnicity, pi.insurance_type, pi.plan_name,
            pi.insured_id, patient.email, patient.mobile_phone_number,
            CASE WHEN patient_identifier IS NULL THEN 'No' ELSE 'Yes' END AS linked_to_hie,
            CASE WHEN pna.user_id IS NOT NULL THEN 'yes' ELSE 'no' END AS linked_to_iis
            from users as patient
            left join customer_users as cu on patient.id = cu.user_id
            left join customers as c on cu.customer_id = c.id
            left join patient_insurances as pi on patient.id = pi.user_id
            left join patient_ndiis_accounts pna on patient.id = pna.user_id
            where cu.status in ('accepted', 'pending') and role = 0
            and c.id = any(array#{customer_ids}) #{get_filters}
            order by c.name, last_name;"

    result = ActiveRecord::Base.connection.execute(sql)
  rescue StandardError => e
      Rollbar.warning("Error on Patient Demographics report repository #{e}")
      return []
  end

end
