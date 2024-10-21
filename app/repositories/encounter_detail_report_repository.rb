class EncounterDetailReportRepository
    include GeneralHelper
    def initialize(attributes)
        @attributes = attributes
        @provider_id = @attributes[:provider_id]
        @customer_id = @attributes[:customer_id]
        @insurance_type = @attributes[:insurance_type]
        @encounter_type = @attributes[:encounter_type]
        @billing_code = @attributes[:billing_code]
        @start_date = @attributes[:start_date]
        @end_date = @attributes[:end_date]
        @admin_report = @attributes[:admin_report]
    end

    def get_encounter_data
        result = get_data
    end

    private 

    attr_accessor :provider_id, :customer_id, :insurance_type, :encounter_type, :billing_code, :start_date, :end_date

    def provider
        @provider ||= User.find(provider_id)
    end

    def customer_ids
        # all the customer that the provider has active association
        if @admin_report
            customer_ids = Customer.all.pluck(:id)
        else
            customers = provider.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
            customer_ids = customers.ids
        end
        
        customer_ids
    end

    def customer
        @customer ||= Customer.find(customer_id)
    end
 
    def get_data
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
            filter += " and lower(eii.insurance_type) = '#{insurance_type.downcase}'"
        end

        if encounter_type.present?
            filter += " and lower(eb.encounter_type) = '#{encounter_type.downcase}'"
        end

        if billing_code.present?
            filter += " and lower(eci.cpt_code) = '#{billing_code.downcase}'"
        end

        if start_date.present?
            # we are expecting start_date and end_date be yyyy-mm-dd
            filter += " and DATE(day_of_encounter) >= '#{start_date}'"
        end

        if end_date.present?
            # we are expecting start_date and end_date be yyyy-mm-dd
            filter += " and DATE(day_of_encounter) <= '#{end_date}'"
        end

        filter
    end

    def get_all_data
        sql = "select 
                u.first_name, u.last_name, u.date_of_birth, u.gender, u.mrn_number, u.address, u.city, u.state, u.zip, u.county, u.race, u.ethnicity, 
                c.name as customer_name, c.county as customer_county, 
                eb.id, eb.day_of_encounter, eb.encounter_type, eb.place_of_service, eb.provider_name, eb.rendering_provider,
                eii.insurance_type AS insurance_type, eii.plan_name AS plan_name, eii.insured_id as insured_id
                ,max(eci.created_at) as date_claim_sent, STRING_AGG(eci.cpt_code, ', ') as cpt_codes, STRING_AGG(eci.diagnosis_code_value, ', ') as diagnosis_codes, 
                STRING_AGG(COALESCE(eci.modifier, ''), ', ') as modifier, 
                COALESCE(SUM(CASE WHEN eci.charges ~ E'^\\\\d+(\\\\.\\\\d+)?$' THEN eci.charges::numeric  ELSE 0  END), 0) AS total_charge            
                from encounter_billings eb
                left join encounter_claim_informations eci on eci.encounter_billing_id = eb.id
                join users u on eb.patient_id = u.id
                join customer_users cu on cu.user_id = u.id
                join customers c on cu.customer_id = c.id
                left join (
                    select
                        encounter_billing_id,
                        insurance_type,
                        plan_name,
                        insured_id,
                        updated_at,
                        ROW_NUMBER() OVER (PARTITION BY encounter_billing_id ORDER BY updated_at desc) AS row_num
                    from encounter_insurance_informations
                ) eii 
                on eb.id = eii.encounter_billing_id AND eii.row_num = 1
                where cu.status in ('accepted', 'pending') and eb.status = 'signed'
                and c.id = any(array#{customer_ids}) #{get_filters}
                group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14, 15, 16,17,18,19,20,21,22,23
                order by c.name, last_name;"

        result = ActiveRecord::Base.connection.execute(sql)
    rescue StandardError => e
        Rollbar.warning("Error on Encounter detail report repository #{e}")
        return []
    end

end
