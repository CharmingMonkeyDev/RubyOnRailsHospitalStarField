class AdtDischarge
    def initialize(attributes)
        @attributes = attributes
        @start_date = @attributes[:start_date]
        @end_date = @attributes[:end_date]
        @customer_id = @attributes[:customer_id]
        @provider_id = @attributes[:provider_id]
        @patient_class = @attributes[:patient_class]
        @action_status = @attributes[:action_status]
        @customer_ids = @attributes[:customer_ids]
    end

    def get_data
        get_adt_data
    end

    private 

    attr_accessor :start_date, :end_date, :customer_id, :provider_id, :patient_class, :action_status, :customer_ids
 
    def get_adt_data
        all_data = get_all_data
        array_data = all_data.to_a
        filtered_data = apply_filters(array_data)
        sanitize_data(filtered_data)
    end

    def get_all_data
        sql = "select apn.id, apn.user_id, event_date, apn.created_at, patient_class, pat.first_name
        as patient_firstname, pat.last_name as patient_lastname, apwa.status as action_status, prov.first_name as provider_firstname, prov.last_name as provider_lastname, prov.id as provider_id
        from adt_patient_notifications as apn
        join users as pat on apn.user_id=pat.id
        left outer join adt_provider_actions as apa on apn.id = apa.adt_patient_notification_id
        left outer join assigned_pathway_week_actions as apwa on apa.assigned_pathway_week_action_id = apwa.id
        left outer join users as prov on apwa.assigned_coach_id=prov.id
        join customer_users as cust on pat.id = cust.user_id
        where cust.customer_id = any (array#{customer_ids})
        group by apn.id, pat.first_name, pat.last_name, apwa.status, prov.first_name, prov.last_name, prov.id;"
        result = ActiveRecord::Base.connection.execute(sql)
    rescue StandardError => e
        Rollbar.warning("Error on ADT Discharge report #{e}")
        return []
    end

    def apply_filters(data)
        final_data = data
        # customer filter are applied while sanitizing
        if start_date.present?
            final_data = final_data.select{|m| m["event_date"]&.to_date >= start_date&.to_date}
        end
        if end_date.present?
            final_data = final_data.select{|m| m["event_date"]&.to_date <= end_date&.to_date}
        end
        if provider_id.present?
            final_data = final_data.select{|m| m["provider_id"] == provider_id&.to_i}
        end

        if patient_class.present?
            final_data = final_data.select{|m| m["patient_class"]&.downcase == patient_class&.downcase}
        end

        if action_status.present?
            final_data = final_data.select{|m| m["action_status"]&.downcase == action_status&.downcase}
        end

        final_data
    end

    def sanitize_data(array_data)
        sanitized_data = sanitize_adt_data(array_data)
        content = {
            adt_data: sanitized_data,
            action_status_counter: get_action_status_counter(sanitized_data)
        }
    end

    def sanitize_adt_data(array_data)
        final_data = []

        array_data.each do |data|
            assigned_customers = customers(data["user_id"])
            if customer_id == "" || assigned_customers.select{|m| m.id == customer_id.to_i}.present?
                sanitized_data = {
                id: data["id"],
                provider: join_fn_ln(data["provider_lastname"], data["provider_firstname"]), 
                patient: "#{data["patient_lastname"]}, #{data["patient_firstname"]}",
                patient_class:  data["patient_class"],
                action_status: data["action_status"]&.titleize,
                event_date: format_date(data["event_date"]),
                created_at_date: format_date(data["created_at"]),
                customer: get_customer(data["user_id"])
            }
                final_data << sanitized_data
            end
            
        end
        final_data
    end

    def get_action_status_counter(sanitized_data)
        {
            unassigned_count: sanitized_data&.select{|m| m[:action_status]&.downcase == "unassigned"}&.count,
            incomplete_count: sanitized_data&.select{|m| m[:action_status]&.downcase  == "incomplete"}&.count,
            complete_count: sanitized_data&.select{|m| m[:action_status&.downcase ] == "complete"}&.count,
        }
    end

    def format_date(date)
        date&.strftime("%m/%d/%y")
    end

    def get_customer(user_id)
        customer_names = customers(user_id).pluck(:name).uniq
        customer_names.join(", ")
    end

    def customers(user_id)
        customers = Customer.joins(:customer_users).where("customer_users.user_id = ? and status != ?",user_id, 'inactive')
    end

    def join_fn_ln(ln,fn)
       return [ln,fn]&.compact&.join(", ")
    end

end
