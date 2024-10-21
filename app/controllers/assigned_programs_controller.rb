class AssignedProgramsController < ApplicationController
  def index
    customer = current_user.customer_selection.customer
    patient = customer.users.find(params[:patient_id])
    assigned_programs = patient.assigned_programs
                               .for_customer(customer.id)
                               .includes(:program, :actions, :action_steps)
                               .order(created_at: :desc)

    render json: Result.new(assigned_programs, "Assigned Programs fetched", true), include: [:program, :actions, :action_steps], status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignedProgramsController::index")
    render json: Result.new(e, "Assigned Programs cannot be fetched", false), status: 500
  end

  def create
    complete_params = assigned_program_params
                  .merge(assigned_by_id: current_user.id, patient_id: params[:patient_id])
    assigned_program = AssignedProgram.create!(complete_params)
    assigned_program.assignment_histories.create(
      description: "Program <b>#{assigned_program.program.title}</b> assigned", 
      patient_id: params[:patient_id],
      user_id: current_user.id
    )
    # CreateLiveActionsJob.perform_later({
    #   assigned_program: assigned_program
    # })
    CreateLiveActions.new({
      assigned_program: assigned_program
    }).call

    log_info("User ID #{current_user&.id} created assigned_program ID #{assigned_program.id}  -- AssignedProgramsController::create")

    render json: Result.new(assigned_program, "You have successfully assigned a new program to this patient.", true), status: 200
  rescue ActiveRecord::RecordInvalid => e
    log_errors(e)
    Rollbar.warning("Validation Error: #{e} -- AssignedProgramsController#create")
    render json: Result.new(nil, e.record.errors.full_messages.join(", "), false), status: :unprocessable_entity
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignedProgramsController#create")
    render json: Result.new(nil, "AssignedProgram cannot be saved", false), status: 500
  end

  def complete_program
    ActiveRecord::Base.transaction do
      assigned_program = AssignedProgram.find(params[:id])
      assigned_program.manually_completed!
      assigned_program.action_queues
                    .where('due_date >= ?', Date.today)
                    .where(status: 'incomplete')
                    .destroy_all
      assigned_program.assignment_histories.create(
        description: "Program <b>#{assigned_program.program.title}</b> completed.", 
        patient_id: params[:patient_id],
        user_id: current_user.id,
        notes: params[:notes],
      )

      log_info("User ID #{current_user&.id} completed assigned_program ID #{assigned_program.id}  -- AssignedProgramsController::complete_program")

      render json: Result.new(assigned_program, "You have successfully completed this program .", true), status: 200
    end
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --AssignedProgramsController#complete_program")
    render json: Result.new(nil, "AssignedProgram cannot be completed", false), status: 500
  end

  private

  def assigned_program_params
    permited_params = %i[program_id start_date]
    params.require(:assigned_program).permit(permited_params)
  end
end
