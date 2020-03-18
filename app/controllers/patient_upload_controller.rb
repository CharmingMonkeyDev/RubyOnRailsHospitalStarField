# frozen_string_literal: true

require 'csv'

class PatientUploadController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include PatientUploadHelper
  include JsonHelper

  def patient_upload
    result = ProcessPatientUpload.new({file: patient_upload_strong_params[:csv].path, invited_by_id: current_user.id}).call
    render json: result, status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --PatientUploadController#patient_upload")
    render json: Result.new(nil, "Patient upload failed", false), status: 500
  end

  private

  def patient_upload_strong_params
    permited_params = %i[csv]
    params.permit(permited_params)
  end
end
