class AssignmentHistoriesController < ApplicationController
  def index
    customer = current_user.customer_selection.customer
    patient = customer.users.find(params[:patient_id])
    assignment_histories = patient.assignment_histories.includes(:user, :loggable)
    if params[:assignment_type] && params[:assignment_type] == "program"
      assignment_histories = assignment_histories.where(loggable_type: 'AssignedProgram')
    end
    if params[:assignment_type] && params[:assignment_type] == "action"
      assignment_histories = assignment_histories.where(loggable_type: 'AssignedProviderAction')
    end

    assignment_histories = assignment_histories.order(created_at: :desc)

    render json: Result.new(assignment_histories, "Assignment Histories fetched", true), include: [:user, :loggable], status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignmentHistoriesController::index")
    render json: Result.new(e, "Assignment histories cannot be fetched", false), status: 500
  end
end
