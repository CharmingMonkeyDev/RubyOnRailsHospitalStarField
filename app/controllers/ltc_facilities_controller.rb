class LtcFacilitiesController < ApplicationController
    def create
        selected_customer = current_user.customer_selection.customer
        LtcFacility.create!(permit_params.merge(
          customer_id: selected_customer.id
        ))
        render json: Result.new(nil, "You have successfully created a facility.", true), status: 200
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end

    def update
        facility = LtcFacility.find(params[:id])
        if facility
            facility.update!(permit_params)
            render json: Result.new(nil, "You have successfully updated the facility.", true), status: 200
        else 
            render json: Result.new(nil, "Facility not found", false), status: 500
        end
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end

    def destroy
        facility = LtcFacility.find(params[:id])
        if facility
            facility.destroy!
            render json: Result.new(nil, "You have successfully deleted the facility.", true), status: 200
        else 
            render json: Result.new(nil, "Facility not found", false), status: 500
        end
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end

    private 

    def permit_params
        params.require(:ltc_facility)
              .permit(:name, :address_1, :address_2, :city, :state, :zip, :phone_number)
    end
end