class DataFetching::DiagnosesController < ApplicationController
    def assigned_diagnoses
        customer = current_user.customer_selection.customer 
        if params[:patient_id]
            patient = customer.users.find(params[:patient_id])
            assigned_diagnoses = patient.assigned_diagnoses
        else
            assigned_diagnoses = DiagnosisAssignment.where(active: true).order(created_at: :asc).uniq 
        end
        render json: Result.new(assigned_diagnoses, "Assigned diagnoses fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, "Error fetching assigned diagnoses", false), status: 500
    end

  def diagnosis_history
      diagnosis_assignments = DiagnosisAssignment.where(user_id: params[:patient_id])
      render json: Result.new(diagnosis_assignments, "Diagnosis history fetched", true), status: 200
  rescue StandardError => e
      log_errors(e)
      render json: Result.new(nil, "Error fetching diagnosis history", false), status: 500
  end

end