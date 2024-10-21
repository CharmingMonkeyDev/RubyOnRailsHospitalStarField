# frozen_string_literal: true

class WeightReadingController < ApplicationController
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
    weight_reading = user.weight_readings.create!(weight_strong_params.merge(created_by_id: current_user.id))

    flash[:notice] = 'The weight reading has been added.'
    log_info("User ID #{current_user&.id} created weight_reading ID #{weight_reading&.id} --WeightReadingController::create")
    json_response('Weight Reading Added', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    reading = WeightReading.find_by_id(params[:id])
    reading.update!(weight_strong_params)

    flash[:notice] = 'The weight reading has been updated.'
    log_info("User ID #{current_user&.id} updated weight_reading ID #{reading&.id} --WeightReadingController::update")
    json_response('Weight Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    reading = WeightReading.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed WeightReading ID #{reading&.id} --WeightReadingController::destroy")
    reading.destroy

    flash[:notice] = 'The weight reading has been removed.'
    json_response('Weight Removed', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def weight_strong_params
    permited_params = %i[reading_value date_recorded notes]
    params.require(:reading).permit(permited_params)
  end
end
