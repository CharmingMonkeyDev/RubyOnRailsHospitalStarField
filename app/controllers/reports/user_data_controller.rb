class Reports::UserDataController < ApplicationController
  def readings
      patient = get_patient(params[:patient_id])
      blood_pressure_reading = patient.blood_pressure_readings.order("date_recorded DESC").first
      glucose_reading = patient.patient_device_readings.where(reading_type: "blood_glucose").order("date_recorded DESC").first
      weight_reading = patient.weight_readings.order("date_recorded DESC").first

      log_info("User ID #{current_user&.id} accessed device readings reading for #{patient&.id} --Reports::UserDataController::readings")
      result = {
        blood_pressure_reading: blood_pressure_reading,
        glucose_reading: glucose_reading,
        weight_reading: weight_reading
      }
      render json: Result.new(result, "Data fetched", true), status: 200
  rescue StandardError => e
      log_errors(e)
      Rollbar.warning("Error: #{e} --Reports::UserDataController::readings")
      render json: Result.new(nil, e, false), status: 500
  end
end
