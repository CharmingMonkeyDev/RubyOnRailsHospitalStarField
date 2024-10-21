class PatientMedicationsController < ApplicationController
  def index
    patient = get_patient(params[:patient_id])
    medications = patient.patient_medications
    log_info("User ID #{current_user&.id} accessed patient medications for patient #{patient&.id} --PatientMedicationsController#PatientMedicationsController")
    render json: Result.new(medications, "Patient medication fetched", true), status: 200
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientMedicationsController#PatientMedicationsController")
    render json: Result.new(nil, e, false), status: 500
  end

  def destroy
    medication = PatientMedication.find_by_id(params[:patient_medication_id])
    patient = medication.user
    log_info("User ID #{current_user&.id} destroyed PatientMedication ID #{medication&.id} --PatientMedicationsController::destroy")
    medication.destroy
    render json: Result.new(patient.patient_medications, "The medication has been removed.", true), status: 200
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientMedicationsController::destroy")
    render json: Result.new(nil, e, false), status: 500
  end

end
