class LabReadingsController < ApplicationController
  include JsonHelper
  def create
    reading = LabReading.create!(permitted_params.merge(created_by_id: current_user.id))
    log_info("User ID #{current_user&.id} created Lab Reading ID  #{reading&.id}  -- LabReadingsController::create")

    flash[:notice] = "#{reading.reading_type&.upcase} has been successfully added."
    json_response('Lab reading Added', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    reading = LabReading.find(params[:id])
    reading.update!(permitted_params)
    log_info("User ID #{current_user&.id} updated Lab Reading ID  #{reading&.id}  -- LabReadingsController::update")

    flash[:notice] = "#{reading.reading_type&.upcase} has been successfully updated."
    json_response('Lab reading Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def permitted_params
    permited_params = %i[reading_value reading_type date_recorded notes user_id]
    params.require(:lab_reading).permit(permited_params)
  end
end
