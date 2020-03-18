class CustomerSelectionsController < ApplicationController
    include JsonHelper

    def new
        active_assigned_customer_ids = current_user.customer_users.where(status: "accepted").pluck(:customer_id)
        @customers = Customer.where(id: active_assigned_customer_ids)

        if active_assigned_customer_ids.count == 1
            CustomerSelection.create!(
                user_id: current_user.id,
                customer_id: active_assigned_customer_ids.first,
                do_not_ask: false
            )
            redirect_to root_path
        end
    end

    def create
        unless permit_params[:customer_id].present?
            flash[:alert] = "No customer selected."
            redirect_to root_path
            return
        end

        if current_user.customer_selection.present?
            current_user.customer_selection.destroy
            CustomerSelection.create!(permit_params.merge({user_id: current_user.id}))
        else
            CustomerSelection.create!(permit_params.merge({user_id: current_user.id}))
        end
        redirect_to root_path
    end

    def update
        customer_selection = CustomerSelection.find(params[:id])
        new_customer_id = params[:new_customer_id]
        active_assigned_customer_ids = current_user.customer_users.where(status: "accepted").pluck(:customer_id)

        if active_assigned_customer_ids.include? new_customer_id
            customer_selection.update(customer_id: new_customer_id)
            customer_selection.update(do_not_ask: params[:do_not_ask]) unless params[:do_not_ask].nil?
            json_response('Customer Selection updated', 200)
        else
            json_response('Cannot update customer selection', 200)
        end
        rescue StandardError => e
            json_response(e, 500)
    end

    private

    def permit_params
        params.require(:customer).permit(:customer_id, :do_not_ask)
    end
end
