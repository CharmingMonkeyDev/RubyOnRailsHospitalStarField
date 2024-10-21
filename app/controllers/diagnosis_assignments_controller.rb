class DiagnosisAssignmentsController < ApplicationController
    def create
        user = User.find(params[:user_id])
        diagnosis_code_value = DiagnosisAssignment.find_by(diagnosis_code_value: params[:diagnosis_code_value])
        user_diagnoses = user.assigned_diagnoses.pluck(:diagnosis_code_value)
        if user_diagnoses.include?(params[:diagnosis_code_value])
            render json: Result.new(nil, "Already assigned this diagnosis to current patient", false), status: 500
        end

        DiagnosisAssignment.create!(permit_params.merge(actor: current_user, active: true))
        render json: Result.new(nil, "Successfully assigned the Diagnosis to current patient", true), status: 200
  rescue StandardError => e
      log_errors(e)
      render json: Result.new(nil, "Failed assigning the Diagnosis to current patient", false), status: 500
  end

    def destroy
        user = User.find(params[:user_id])
        user_diagnoses = user.assigned_diagnoses.pluck(:diagnosis_code_value)

        if user_diagnoses.include?(params[:diagnosis_code_value])
            assigned_diagnosis = user.diagnosis_assignments.find_by(diagnosis_code_value: params[:diagnosis_code_value], active: true)
            assigned_diagnosis.update!(active: false) if assigned_diagnosis
        else
            log_info("Assigned Diagnosis not found for user_id #{params[:user_id]} and diagnosis_code_value: #{params[:diagnosis_code_value]}")
        end
        
        DiagnosisAssignment.create!(permit_params.merge(actor: current_user, active: false))
        render json: Result.new(nil, "You have successfully removed the diagnosis from the patient", true), status: 200    
  rescue StandardError => e
      log_errors(e)
      render json: Result.new(nil, "Failed to remove the diagnosis from the patient", false), status: 500
  end

    def permit_params
        params.require(:diagnosis_assignment).permit(:user_id, :diagnosis_code_value, :diagnosis_code_desc, :action_type)
    end
end