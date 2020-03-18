class ActionStepAutomationsController < ApplicationController
  include JsonHelper

  def create
    automation = ActionStepAutomation.create!(permitted_params)

    log_info("User ID #{current_user&.id} created Automation ID #{automation.id}  -- ActionStepAutomationsController::create")

    flash[:notice] = "The  automation item has been added."
    log_info("User ID #{current_user&.id} created automation ID #{automation&.id}  -- ActionStepAutomationsController::create")
    render json: Result.new(automation, "Automation Created", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepAutomationsController::create")
    render json: Result.new(nil, "Automation cannot be created.", false), status: 500
  end

  private
  def permitted_params
    parameters = %i[ automation_type questionnaire_id ]
    params.require(:automation).permit(parameters)
  end
end
