class CustomerUserPrivilegesController < ApplicationController
    def update
        privilege = CustomerUserPrivilege.find(params[:id])
        privilege.update!(privilege_state: update_permitted_params[:checked])
        log_info("User ID #{current_user&.id} updated privileges for User ID #{privilege&.customer_user&.user&.id} --DataFetching::PrivilegesController::update")
        render json: Result.new(nil, "Privilege updated", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Privilege updated", false), status: 500
    end

    def reset_customer_user_privileges
        user = User.find(params[:user_id])
        selected_customer = current_user.customer_selection.customer
        customer_user = user.customer_users.where(customer: selected_customer, user: user)
        customer_user_privileges = CustomerUserPrivilege.where(customer_user: customer_user)
        customer_user_privileges.each do |privilege|
            default_privilege = CustomerDefaultPrivilege.where(privilege_id: privilege.privilege_id, customer_id: selected_customer.id).first
            if default_privilege.nil?
                next
            end

            if user.role == "pharmacist"
                privilege.privilege_state = default_privilege.default_pharmacist
            end
            if user.role == "physician"
                privilege.privilege_state = default_privilege.default_physician
            end
            if user.role == "health_coach"
                privilege.privilege_state = default_privilege.default_coach
            end
            if user.role == "patient"
                privilege.privilege_state = default_privilege.default_patient
            end
            privilege.save!
        end
        log_info("User ID #{current_user&.id} reset privileges to default for User ID #{user&.id} --DataFetching::PrivilegesController::reset_customer_user_privileges")
        render json: Result.new(nil, "Privileges reset", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Privilege reset", false), status: 500
    end

    def clone_customer_user_privileges
        user = User.find(params[:user_id])
        selected_customer = current_user.customer_selection.customer
        clone_customer_user = CustomerUser.where(user_id: clone_permitted_params[:clone_user_id], customer: selected_customer, status: ["accepted", "pending"]).first
        clone_user_privileges = clone_customer_user.customer_user_privileges
        customer_user = CustomerUser.where(user: user, customer: selected_customer).first
        customer_user_privileges = customer_user.customer_user_privileges
        customer_user_privileges.each do |privilege|
            privilege.privilege_state = clone_user_privileges.where(privilege_id: privilege.privilege_id).first.privilege_state
            privilege.save!
        end
        log_info("User ID #{current_user&.id} cloned privileges from User ID #{clone_customer_user&.user_id} to User ID #{user&.id} --DataFetching::CustomerUserPrivilegeController::clone_customer_user_privileges")
        render json: Result.new(nil, "Privileges reset", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Privilege reset", false), status: 500
    end

    private

    def update_permitted_params
        params.require(:customer_user_privilege).permit(:checked)
    end
    
    def clone_permitted_params
        params.require(:customer_user_privilege).permit(:clone_user_id)
    end
end
