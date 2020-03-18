class ProviderCustomerUsersController < ApplicationController
# this customerUser  used only for providers for patientUser  refere to customer_users controller
    include JsonHelper
    before_action :verify_two_factor

    def new 
        active_assigned_customer_ids = current_user.customer_users.where(status: "accepted").pluck(:customer_id)
        customers = Customer.where(id: active_assigned_customer_ids)
        result = {
            customers: customers
        }
        json_data_response(result)
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --ProviderCustomerUsersController::new")
        json_response(e, 500)
    end

    def create
        customer_user = CustomerUser.create!(
            user_id: permit_params[:user_id],
            customer_id: permit_params[:customer_id],
            assigned_at: Time.now,
            status: "accepted",
            created_by_id: current_user.id
        )
        AssignCustomerUserPrivileges.new({customer_user: customer_user}).call
        CustomerAssociationMailer.new_customer_association_provider(customer_user.user, customer_user.customer).deliver
        render json: Result.new(nil, "Customer is successfully associated", true), status: 200
    rescue => e
        Rollbar.warning("Error: #{e} --ProviderCustomerUsersController::create")
        render json: Result.new(nil, e, false), status: 500
    end

    def destroy
        customer_user = CustomerUser.find(params[:id])
        customer_user.update!(
            cancelled_at: Time.now,
            status: "inactive"
        )
        user = customer_user&.user
        if customer_user.customer_id == user&.customer_selection&.customer_id
            first_active_customer_id = user.customer_users&.active&.first&.customer_id
            user.customer_selection.update(customer_id: first_active_customer_id)
        end
        json_response('Association is destroyed', 200)
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --ProviderCustomerUsersController::destroy")
        json_response(e, 500)
    end

    private

    def permit_params
        params.require(:customer_user).permit(:user_id, :customer_id)
    end
end