class CompanyActionSettingsController < ApplicationController
  def index
    selected_customer = current_user.customer_selection.customer
    settings = selected_customer.company_action_setting
    log_info("User ID #{current_user&.id} fetched Company Settings for company  #{selected_customer&.id}  -- ActionSettingsController::index")

    render json: Result.new(settings, "Action Settings fetched", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --CompanyActionSettingsController::index")
    json_response(e, 500)
  end

  def create
    selected_customer = current_user.customer_selection.customer
    settings = selected_customer.company_action_setting
    if settings.nil?
      CompanyActionSetting.create!(permitted_params.merge(customer_id: selected_customer.id))
    else
      settings.update!(permitted_params)
    end
    log_info("User ID #{current_user&.id} updated Company Settings for company  #{selected_customer&.id}  -- ActionSettingsController::update")

    render json: Result.new(settings, "Action Settings updated", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --CompanyActionSettingsController::create")
    render json: Result.new(nil, "Server Error", true), status: 200
  end

  private

  def permitted_params
    permited_params = %i[global_action_future_days global_action_past_days patient_action_past_days patient_action_future_days] 
    params.permit(permited_params)
  end
end
