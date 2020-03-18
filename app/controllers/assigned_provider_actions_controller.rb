class AssignedProviderActionsController < ApplicationController
  def index
    customer = current_user.customer_selection.customer
    patient = customer.users.find(params[:patient_id])
    assigned_actions = patient.assigned_provider_actions
                              .for_customer(customer.id)
                              .includes(:action, :action_steps)
                              .order(created_at: :desc)

    render json: Result.new(assigned_actions, "Assigned Actions fetched", true), include: [:action, :action_steps], status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignedProviderActionsController::index")
    render json: Result.new(e, "Assigned Actions cannot be fetched", false), status: 500
  end

  def create
    complete_params = assigned_provider_action_params
                  .merge(assigned_by_id: current_user.id, patient_id: params[:patient_id])
    assigned_action = AssignedProviderAction.create!(complete_params)
    CreateLiveActions.new({
      assigned_provider_action: assigned_action
    }).call
    assigned_action.assignment_histories.create(
      description: "Action <b>#{assigned_action.action.title}</b> assigned", 
      patient_id: params[:patient_id],
      user_id: current_user.id
    )

    log_info("User ID #{current_user&.id} created assigned_action ID #{assigned_action.id}  -- AssignedProviderActionsController::create")

    render json: Result.new(assigned_action, "You have successfully assigned a new action to this patient.", true), status: 200
  rescue ActiveRecord::RecordInvalid => e
    log_errors(e)
    Rollbar.warning("Validation Error: #{e} -- AssignedProviderActionsController#create")
    render json: Result.new(nil, e.record.errors.full_messages.join(", "), false), status: :unprocessable_entity
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignedProviderActionsController#create")
    render json: Result.new(nil, "AssignedProgram cannot be saved", false), status: 500
  end

  def complete_action
    ActiveRecord::Base.transaction do
      assigned_action = AssignedProviderAction.find(params[:id])
      
      assigned_action.action_queues
                    .where('due_date >= ?', Date.today)
                    .where(status: 'incomplete')
                    .destroy_all
      assigned_action.manually_completed!
      assigned_action.assignment_histories.create(
        description: "Action <b>#{assigned_action.action.title}</b> completed.", 
        patient_id: params[:patient_id],
        user_id: current_user.id,
        notes: params[:notes],
      )

      log_info("User ID #{current_user&.id} completed assigned_action ID #{assigned_action.id}  -- AssignedProviderActionsController::complete_program")

      render json: Result.new(assigned_action, "You have successfully completed this program .", true), status: 200
    end
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignedProviderActionsController#complete_program")
    render json: Result.new(nil, "AssignedProviderAction cannot be completed", false), status: 500
  end

  private

  def assigned_provider_action_params
    permited_params = %i[action_id start_date]
    params.require(:assigned_provider_action).permit(permited_params)
  end
end
