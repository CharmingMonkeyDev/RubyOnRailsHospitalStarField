class LtcFacilityAssignmentsController < ApplicationController
    def create
        user = User.find(params[:user_id])
        ltc_facility = LtcFacility.find(params[:ltc_facility_id])

        if user.ltc_facility && user.ltc_facility.id == params[:ltc_facility_id].to_i
            render json: Result.new(nil, "Already assigned this facility to current patient", false), status: 500
        end

        LtcFacilityAssignment.create!(permit_params.merge(actor: current_user, active: true))
        user.update!(ltc_facility: ltc_facility)
        render json: Result.new(nil, "Successfully assigned the living facility to current patient", true), status: 200
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, "Failed assigning the living facility to current patient", false), status: 500
    end

    def update
        user = User.find(params[:user_id])
        ltc_facility = LtcFacility.find(params[:ltc_facility_id])

        if user.ltc_facility && user.ltc_facility.id == params[:id].to_i
            user.ltc_facility_assignments.update_all(active: false)
        else
            log_info("Assigned living facility not found for user_id #{params[:user_id]} and ltc_facility_id: #{params[:id]}")
        end

        # If the action_type is remove, new assignment will be inactive.
        if params[:action_type] == "transfer"
            user.update!(ltc_facility: ltc_facility)
            LtcFacilityAssignment.create!(permit_params.merge(actor: current_user, active: true))
        else
            user.update!(ltc_facility: nil)
            LtcFacilityAssignment.create!(permit_params.merge(actor: current_user, active: false))
        end
        render json: Result.new(nil, "You have successfully updated the living facility assignment", true), status: 200    
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, "Failed to update the living facility assignment", false), status: 500
    end

    private 

    def permit_params
        params.require(:ltc_facility_assignment).permit(:user_id, :ltc_facility_id, :action_type)
    end
end