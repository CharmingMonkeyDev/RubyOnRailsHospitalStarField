if CustomerUserPrivilege.count.zero?
    CustomerUser.all.each do |customer_user|
        Privilege.all.each do |privilege|
            customer_id = customer_user.customer.id
            privilege_id = privilege.id
            role = customer_user.user.role
            customer_default_privilege = CustomerDefaultPrivilege.where(customer_id: customer_id, privilege_id: privilege_id).first
            if customer_default_privilege.nil?
                customer_default_privilege = CustomerDefaultPrivilege.create(
                    customer_id: customer_id, 
                    privilege_id: privilege.id,
                    default_pharmacist: privilege.default_pharmacist,
                    default_physician: privilege.default_physician,
                    default_coach: privilege.default_coach,
                    default_patient: privilege.default_patient
                )
            end
            privilege_state = false
            if role == "pharmacist"
                privilege_state = customer_default_privilege.default_pharmacist
            end
            if role == "physician"
                privilege_state = customer_default_privilege.default_physician
            end
            if role == "patient"
                privilege_state = customer_default_privilege.default_patient
            end
            if role == "health_coach"
                privilege_state = customer_default_privilege.default_coach
            end
            CustomerUserPrivilege.create!(
                customer_user_id: customer_user.id,
                privilege_id: privilege_id,
                privilege_state: privilege_state
            )
        end
    end
end
