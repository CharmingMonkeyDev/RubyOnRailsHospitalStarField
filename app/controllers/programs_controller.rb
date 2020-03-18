class ProgramsController < ApplicationController
  include JsonHelper

  def index
    customer = current_user.customer_selection.customer
    programs = customer.programs
    if params[:status].present?
      programs = programs.where(status: params[:status])
    end
    json_data_response({ programs: programs.order(published_at: :desc) })
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#index")
    json_response(e, 500)
  end

  def create
    customer = current_user.customer_selection.customer
    program = customer.programs.create!(programs_strong_params)

    action_ids = params[:action_ids]
    ActiveRecord::Base.transaction do
      if action_ids.present?
        action_ids.each do |action_id|
          program_action = ProgramAction.create(program_id: program.id, action_id: action_id)
        end
      end
    end

    log_info("User ID #{current_user&.id} created program ID #{program.id}  -- ProgramsController::create")

    render json: Result.new(program, "Program saved as #{program.status}", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#create")
    render json: Result.new(nil, "Program cannot be saved", false), status: 500
  end

  def show
    customer = current_user.customer_selection.customer
    program = customer.programs.includes(actions: :action_recurrence).find(params[:id])
    program.actions = program.actions.order(:title) # Order actions by title

    log_info("User ID #{current_user&.id} accessed program ID #{program&.id}  -- ProgramsController::show")

    render json: Result.new(program, "Program fetched", true), include: { actions: { include: :action_recurrence } }, status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#show")
    render json: Result.new(nil, "Program cannot be fetched", false), status: 500
  end

  def update
    customer = current_user.customer_selection.customer
    program = customer.programs.find(params[:id])
    program.update!(programs_strong_params)
    log_info("User ID #{current_user&.id} updated program ID #{program&.id}  -- ProgramsController::update")

    render json: Result.new(program, "Program updated", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#update")
    render json: Result.new(nil, "Program cannot be updated", false), status: 500
  end

  def publish
    program = Program.find(params[:id])
    program.update(published_at: Time.now, status: "published" )
    json_response('Program published', 200)
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#publish")
    json_response('Program cannot be published', 500)
  end

  def destroy
    program = Program.find(params[:id])
    if program.status == "draft"
      program.destroy
      message = "Program deleted successfully"
    else
      program.update(is_archived: true)
      program.update(status: "archived")
      message = "Program archived successfully"
    end
    render json: Result.new(nil, message, true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#destroy")
    render json: Result.new(nil, "Program cannot be archived/deleted", false), status: 500
  end

  def save_actions_to_db
    customer = current_user.customer_selection.customer
    program = customer.programs.find(params[:id])

    action_ids = params[:action_ids]
    existing_program_action_ids = program.program_actions.ids
    to_keep_action_ids = []
    ActiveRecord::Base.transaction do
      if action_ids.present?
        action_ids.each do |action_id|
          program_action = ProgramAction.where(program_id: program.id, action_id: action_id).first
          if !program_action 
              program_action = ProgramAction.create(program_id: program.id, action_id: action_id)
          end
          to_keep_action_ids << program_action.id
        end
      end
      to_remove_program_action_ids = existing_program_action_ids - to_keep_action_ids
      ProgramAction.where(id: to_remove_program_action_ids).destroy_all
    end
    
    log_info("User ID #{current_user&.id} updated program ID #{program&.id}  -- ProgramsController::save_actions_to_db")

    render json: Result.new(program, "Program Actions Updated", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ProgramsController#save_actions_to_db")
    render json: Result.new(nil, "Program Actions cannot be updated", false), status: 500
  end

  private
  def programs_strong_params
    permited_params = %i[title status published_at subtext]
    params.require(:program).permit(permited_params)
  end
end
