# frozen_string_literal: true

class BloodPressureReadingController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection

  include JsonHelper

  def create
    user = current_user
    if user.is_provider? and params[:patient_id].present?
      patient = User.find_by_id(params[:patient_id])
      if user.present?
        user = patient
      end
    end
    
    blood_pressure_reading = user.blood_pressure_readings.create!(blood_pressure_strong_params.merge(created_by_id: current_user.id))
    log_info("User ID #{current_user&.id} updated created BloodPressureReading ID #{blood_pressure_reading&.id} -- BloodPressureReadingController::create")
    flash[:notice] = 'The blood pressure reading has been added.'
    json_response('Blood Pressure Reading Added', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    reading = BloodPressureReading.find_by_id(params[:id])
    reading.update!(blood_pressure_strong_params)

    flash[:notice] = 'The weight reading has been updated.'
    log_info("User ID #{current_user&.id} updated BloodPressureReading ID #{reading&.id} -- BloodPressureReadingController::update")
    json_response('Blood Pressure Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    reading = BloodPressureReading.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed BloodPressureReading ID #{reading&.id} -- BloodPressureReadingController::destroy")
    reading.destroy

    flash[:notice] = 'The blood pressure reading has been removed.'
    json_response('Blood Pressure Removed', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def blood_pressure_strong_params
    permited_params = %i[systolic_value diastolic_value date_recorded notes]
    params.require(:reading).permit(permited_params)
  end
end
