class ProgramActionsController < ApplicationController
  include JsonHelper

  def show
    customer = current_user.customer_selection.customer
    program_action = customer.program_actions.where(program_id: params[:program_id], action_id: params[:action_id]).first

    log_info("User ID #{current_user&.id} accessed program action ID #{program_action&.id}  -- ProgramActionsController::show")

    render json: Result.new(program_action, "Program Action fetched", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramActionsController#show")
    render json: Result.new(nil, "Program Action cannot be fetched", false), status: 500
  end

  def update
    customer = current_user.customer_selection.customer
    program_action = customer.program_actions.find(params[:id])
    program_action.update!(program_actions_strong_params)
    log_info("User ID #{current_user&.id} updated program action ID #{program_action&.id}  -- ProgramActionsController::update")

    render json: Result.new(program_action, "Program Action Recurrence updated", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramActionsController#update")
    render json: Result.new(nil, "Program Action cannot be updated", false), status: 500
  end

  private
  def program_actions_strong_params
    permited_params = [
      :override_recurrence, :start_on_program_start, :start_after_program_start_value,
      :start_after_program_start_unit, :repeat, :repeat_value, :repeat_unit, :monday, :tuesday, :wednesday, :thursday,
      :friday, :saturday, :sunday, :end_after_occurences, :occurences, :end_after_program_start, :end_date_value,
      :end_after_program_start_value, :end_after_program_start_unit, :end_timing
    ]
    params.require(:program_action).permit(permited_params)
  end
end
