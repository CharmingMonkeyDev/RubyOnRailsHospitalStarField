# frozen_string_literal: true

require 'net/http'

class PatientDeviceReadingController < ApplicationController
  before_action :verify_two_factor
  include PatientDeviceHelper
  include JsonHelper

  def add_blood_glucose
    if add_glucose_strong_params[:patient_device_id].to_i.zero?
      device = PatientDevice.create!(user_id: params[:patient_id], identifier: '')
      log_info("User ID #{current_user&.id} created PatientDevice ID  #{device&.id}  -- PatientDeviceReadingController::add_blood_glucose")
      device.patient_device_readings.create!(add_glucose_strong_params.merge(created_by_id: current_user.id))
      log_info("User ID #{current_user&.id} created patient_device_readings for PatientDevice ID  #{device&.id}  -- PatientDeviceReadingController::add_blood_glucose")
    else
      reading = PatientDeviceReading.create!(add_glucose_strong_params.merge(created_by_id: current_user.id))
      log_info("User ID #{current_user&.id} created PatientDeviceReading ID  #{reading&.id}  -- PatientDeviceReadingController::add_blood_glucose")
    end

    flash[:notice] = 'The blood glucose reading has been added.'
    json_response('Blood Glucose Added', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def update_blood_glucose
    reading = PatientDeviceReading.find_by_id(update_glucose_strong_params[:id])
    reading.update!(update_glucose_strong_params)
    log_info("User ID #{current_user&.id} updated PatientDeviceReading ID #{reading&.id}  -- PatientDeviceReadingController::update_blood_glucose")
    flash[:notice] = 'The blood glucose reading has been updated.'
    json_response('Blood Glucose Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def remove_blood_glucose
    reading = PatientDeviceReading.find_by_id(params[:reading][:patient_device_reading_id])
    log_info("User ID #{current_user&.id} destroy PatientDeviceReading ID #{reading&.id}  -- PatientDeviceReadingController::remove_blood_glucose")
    reading.destroy

    flash[:notice] = 'The blood glucose reading has been removed.'
    json_response('Blood Glucose Removed', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def check_device
    # check to see if we already have a device or not
    valid_device = false
    device = PatientDevice.where(identifier: patient_device_strong_params[:identifier]).first
    valid_device = true if device

    # Check iglucose system for device
    valid_device ||= device_lookup(patient_device_strong_params[:identifier])

    # Check if there is an existing patient device record, update it if so
    if valid_device
      patient_device = PatientDevice.find_or_initialize_by(user_id: current_user.id)
      patient_device.identifier = patient_device_strong_params[:identifier]
      patient_device.save!
      flash[:notice] = "Your device was linked successfully: #{patient_device_strong_params[:identifier]}"
    end

    log_info("User ID #{current_user.id} accessed PatientDevice  #{patient_device&.id}  -- PatientDeviceReadingController::check_device")
    json_data_response({ message: 'Device Check Results', valid_device: valid_device })
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def patient_device_strong_params
    permited_params = %i[identifier]
    params.require(:patient_device).permit(permited_params)
  end

  def add_glucose_strong_params
    permited_params = %i[reading_value reading_type date_recorded source patient_device_id notes]
    params.require(:reading).permit(permited_params)
  end

  def update_glucose_strong_params
    permited_params = %i[reading_value reading_type date_recorded source patient_device_id notes id]
    params.require(:reading).permit(permited_params)
  end
end
