class DataFetching::PrivilegesController < ApplicationController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?
  def get_user_privileges
        user = User.find(params[:user_id])
        selected_customer = current_user.customer_selection.customer
        customer_user = user.customer_users.where(customer_id: selected_customer.id).first
        cloneable_users = []
        customer_users = CustomerUser.joins(:user).where(customer: selected_customer, status: ["accepted", "pending"])
        if user.role == "patient"
            customer_users.each do |u|
                if u.user.role == "patient" && u.user.id != user.id
                    cloneable_users << u.user
                end
            end
        elsif user.role != "patient"
            customer_users.each do |u|
                if u.user.id != user.id && u.user.role != "patient"
                    cloneable_users << u.user
                end
            end
        end
        user_privileges = CustomerUserPrivilege.where(customer_user_id: customer_user.id).joins(:privilege)
        privilege_array = []
        user_privileges.each do |user_privilege|
            privilege_obj = {}
            privilege_obj["id"] = user_privilege.id
            privilege_obj["name"] = user_privilege.privilege.name
            privilege_obj["state"] = user_privilege.privilege_state
            privilege_array << privilege_obj
        end
        privilege_array.sort_by! { |k| k["name"]}
        log_info("User ID #{current_user&.id} accessed privileges list for User ID #{user&.id} --DataFetching::PrivilegesController::get_user_privileges")
        result = {
            privileges: privilege_array,
            cloneable_users: cloneable_users
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --DataFetching::PrivilegesController::get_user_privileges")
        render json: Result.new(nil, "Data fetched", false), status: 500
    end
end
