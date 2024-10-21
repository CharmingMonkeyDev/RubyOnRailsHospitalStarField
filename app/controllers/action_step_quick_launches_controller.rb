class ActionStepQuickLaunchesController < ApplicationController
  include JsonHelper

  def create
    ql = ActionStepQuickLaunch.create!(permitted_params)


    log_info("User ID #{current_user&.id} created Quick Luanch ID #{ql.id}  -- ActionStepQuickLaunchesController::create")

    flash[:notice] = "The quick launch item has been added."
    log_info("User ID #{current_user&.id} created Quicklaunch ID #{ql&.id}  -- ActionStepQuickLaunchesController::create")
    render json: Result.new(ql, "Quick Luanch Created", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepQuickLaunchesController::create")
    render json: Result.new(nil, "Quick Luanch cannot be created.", false), status: 500
  end

  private
  def permitted_params
    p_params = %i[ launch_type questionnaire_id ]
    params.require(:quick_launch).permit(p_params)
  end
end
