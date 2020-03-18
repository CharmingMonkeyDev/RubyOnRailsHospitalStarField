class DataFetching::LtcFacilitiesController < ApplicationController
    def index
        customer = current_user.customer_selection.customer 
        facilities_with_patient_count = customer.ltc_facilities
        render json: Result.new(facilities_with_patient_count, "Living Facilities Fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e}  --DataFetching::LtcFacilitiesController::index")
        render json: Result.new(nil, e, false), status: 500
    end

    def assigned_ltc_facility
        user = User.find(params[:patient_id])
        assigned_ltc_facility = user.assigned_facility
        render json: Result.new(assigned_ltc_facility, "Assigned LTC facility fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, "Error fetching assigned LTC facility", false), status: 500
    end

    def ltc_history
        ltc_assignments = LtcFacilityAssignment.where(user_id: params[:patient_id])
        render json: Result.new(ltc_assignments, "LTC history fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, "Error fetching LTC history", false), status: 500
    end

end
