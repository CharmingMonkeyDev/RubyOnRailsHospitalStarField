class ImReportRepository
    def initialize(attributes)
        @attributes = attributes
        @provider_id = @attributes[:provider_id]
        @customer_id = @attributes[:customer_id]
        @insurance_type = @attributes[:insurance_type]
        @im_type = @attributes[:im_type]
        @start_date = @attributes[:start_date]
        @end_date = @attributes[:end_date]
    end

    def get_data
        result = get_im_data
    end

    private 

    attr_accessor :provider_id, :customer_id, :insurance_type, :im_type, :start_date, :end_date

    def provider
        @provider ||= User.find(provider_id)
    end

    def customer_ids
        # all the customer that the provider has active association
        customers = provider.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        customer_ids = customers.ids
        customer_ids
    end

    def customer
        @customer ||= Customer.find(customer_id)
    end
 
    def get_im_data
        all_data = get_all_data
        array_data = all_data.to_a
        array_data
    end

    def get_filters
        filter = ""
        if customer_id.present?
            filter += "and c.id = #{customer_id}"
        end

        if insurance_type.present?
            filter += "and lower(pi.insurance_type) = '#{insurance_type.downcase}'"
        end

        if im_type.present?
            filter += "and lower(pfi.vaccine_type) = '#{im_type.downcase}'"
        end

        if start_date.present?
            # we are expecting start_date and end_date be yyyy-mm-dd
            filter += "and DATE(pfi.recommended_date) >= '#{start_date}'"
        end

        if end_date.present?
            # we are expecting start_date and end_date be yyyy-mm-dd
            filter += "and DATE(pfi.recommended_date) <= '#{end_date}'"
        end

        filter
    end

    def get_all_data
        sql = "select  distinct on (pfi.id) pfi.id, 
            c.name, c.county as customer_county, patient.first_name, 
            patient.last_name, patient.middle_name, patient.date_of_birth,
            patient.gender, patient.mrn_number, patient.address, 
            patient.city, patient.state, patient.zip, patient.county, 
            patient.race, patient.ethnicity, pi.insurance_type, pi.plan_name,
            pi.insured_id, pfi.vaccine_type, pfi.recommended_date, pfi.given_date, 
            pfi.defer_date, 
            CONCAT(provider.last_name, ', ', provider.first_name) 
            AS prov_name from patient_forecast_immunizations as pfi
            join users as patient on pfi.user_id = patient.id
            join customer_users as cu on patient.id = cu.user_id
            join customers as c on cu.customer_id = c.id
            left join patient_insurances as pi on patient.id = pi.user_id
            left join users as provider on pfi.provider_id = provider.id
            where cu.status in ('active', 'pending')
            and c.id = any(array#{customer_ids}) #{get_filters}
            and (pfi.defer_date is not null or pfi.given_date is not null)
            ;"
        result = ActiveRecord::Base.connection.execute(sql)
    rescue StandardError => e
        Rollbar.warning("Error on IM report repository #{e}")
        return []
    end

end
