class CustomerUsersController < ApplicationController

    # this customerUser  used only for patients for provider user refere to provider_customer_users controller
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
            json_response(e, 500)
    end

    def create
        patient_user = User.find(permit_params[:user_id])
        status = patient_user.not_invited? ? "accepted" : "pending"
        customer_user = CustomerUser.create!(
            user_id: permit_params[:user_id],
            customer_id: permit_params[:customer_id],
            assigned_at: Time.now,
            status: status,
            created_by_id: current_user.id
        )
        unless patient_user.not_invited?
            PatientProfileMailer.new_patient_customer_association(customer_user.user_id, customer_user.id).deliver
        end
        AssignCustomerUserPrivileges.new({customer_user: customer_user}).call
        render json: Result.new(nil, "Invitation to new customer asssociation is sent", true), status: 200
        rescue => e
            render json: Result.new(nil, e, false), status: 500
    end

    def destroy
        customer_user = CustomerUser.find(params[:id])
        customer_user.update(
            cancelled_at: Time.now,
            status: "inactive"
        )
        
        json_response('Invitation to new customer asssociation is sent', 200)
    rescue StandardError => e
        json_response(e, 500)
    end

    def resend_customer_user_association_patient
        customer_user = CustomerUser.find(params[:customer_user_id])
        customer_user.update(
            assigned_at: Time.now,
        )
        PatientProfileMailer.new_patient_customer_association(customer_user.user_id, customer_user.id).deliver
        json_response('Invitation is send to patient', 200)
        rescue StandardError => e
            json_response(e, 500)
    end

    private

    def permit_params
        params.require(:customer_user).permit(:user_id, :customer_id)
    end
end
