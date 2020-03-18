# frozen_string_literal: true

class AssignCustomerUserPrivileges
    def initialize(attributes)
        @attributes = attributes
        @customer_user = @attributes[:customer_user]
        @creation_type = @attributes[:creation_type] || nil

    end

    def call
        assign_customer_user_privileges
    end

    private
    
    def assign_customer_user_privileges
        customer_id = @customer_user.customer.id
        role = @customer_user.user.role
        Privilege.all.each do |privilege|
            customer_default_privilege = CustomerDefaultPrivilege.where(customer_id: customer_id, privilege_id: privilege.id).first

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
            if role == "health_coach"
                privilege_state = customer_default_privilege.default_coach
            end

            if @creation_type == "new"
                privilege_state = true
            end
            CustomerUserPrivilege.create!(
                customer_user_id: @customer_user.id,
                privilege_id: privilege.id,
                privilege_state: privilege_state
            )
        end
    end
end