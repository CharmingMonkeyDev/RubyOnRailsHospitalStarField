class ActionsController < ApplicationController
  include JsonHelper

  def assets
    customer = current_user.customer_selection.customer 
    categories = customer.action_categories
    render json: Result.new({categories: categories}, "Action assets fetched", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::assets")
    render json: Result.new(nil, "Action assets cannot be fetched", false), status: 500
  end

  def index
    customer = current_user.customer_selection.customer
    actions = customer.actions
                      .where('action_type IS NULL OR action_type != ?', Action.action_types[:questionnaire_submission])
                      .order('LOWER(category)')
                      .order('LOWER(title)')
    if params[:status]
      actions = actions.where(status: params[:status])
    end
    if params[:unassociated] and params[:unassociated] == "1"
      actions = actions
                  .left_outer_joins(:program_actions)
                  .where(program_actions: { program_id: nil })
    end
    actions = actions.includes(:action_steps, :resources).order(created_at: :desc)
    render json: Result.new(actions, "Actions fetched", true), include: [:action_steps, :resources], status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::index")
    json_response(e, 500)
  end

  def show
    customer = current_user.customer_selection.customer
    action = customer.actions.includes(:action_recurrence).find(params[:id])
    log_info("User ID #{current_user&.id} accessed Action ID #{action&.id}  -- ActionsController::show")

    render json: Result.new(action, "Action fetched", true), include: [:action_category, :action_recurrence, :action_steps], status: 200
  rescue ActiveRecord::RecordNotFound
    render json: Result.new(nil, "Not found", false), status: 404
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::show")
    render json: Result.new(nil, "Action cannot be fetched", false), status: 500
  end

  def create
    customer = current_user.customer_selection.customer
    action = customer.actions.create!(actions_strong_params)
    ActionRecurrence.create!(actions_recurrence_strong_params.merge(action: action))
    resource_ids = params[:resource_ids]
    if resource_ids
        resource_ids.each do |resource_id|
            ProviderActionResource.create(action_id: action.id, resource_item_id: resource_id)
        end
    end
    action_step_ids = params[:action_step_ids]
    if action_step_ids
        action_step_ids.each do |action_step_id|
          ActionStep.find(action_step_id).update(action: action)
        end
    end

    log_info("User ID #{current_user&.id} created Action ID #{action.id}  -- ActionsController::create")

    flash[:notice] = "The action has been created: #{action.title}"
    log_info("User ID #{current_user&.id} accessed Action ID #{action&.id}  -- ActionsController::create")

    render json: Result.new(action, "Action saved as #{action.status}", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::create")
    render json: Result.new(nil, "Action cannot be saved", false), status: 500
  end

  def update
    customer = current_user.customer_selection.customer
    action = customer.actions.find(params[:id])
    action.update!(actions_strong_params)
    recurrence = action.action_recurrence
    if recurrence
      recurrence.update!(actions_recurrence_strong_params)
    else
      ActionRecurrence.create!(actions_recurrence_strong_params.merge(action: action))
    end
    
    resource_ids = params[:resource_ids]
    existing_ar_ids = action.provider_action_resources.ids
    to_keep_action_ids = []
    ActiveRecord::Base.transaction do
      resource_ids.each do |resource_id|
        ar = ProviderActionResource.where(action_id: action.id, resource_item_id: resource_id).first
        if !ar 
            ar = ProviderActionResource.create(action_id: action.id, resource_item_id: resource_id)
        end
        to_keep_action_ids << ar.id
      end
      to_remove_ar_ids = existing_ar_ids - to_keep_action_ids
      ProviderActionResource.where(id: to_remove_ar_ids).destroy_all

      action_step_ids = params[:action_step_ids] || []
      current_step_ids = action.action_steps.pluck(:id)
      steps_to_remove = current_step_ids - action_step_ids
      steps_to_add = action_step_ids - current_step_ids

      # Remove the steps that are no longer associated with the action
      action.action_steps.where(id: steps_to_remove).destroy_all

      # Update steps to the add action
      steps_to_add.each do |step_id|
        # action.action_steps.create!(id: step_id) unless action.action_steps.exists?(id: step_id)
        ActionStep.find(step_id).update(action: action)
      end
    end

    log_info("User ID #{current_user&.id} updated Action ID #{action&.id}  -- ActionsController::update")

    flash[:notice] = 'The action has been updated'
    log_info("User ID #{current_user&.id} accessed Action ID  #{action&.id}  -- ActionsController::update")
    render json: Result.new(action, "Action updated", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::update")
    render json: Result.new(nil, "Action cannot be updated", false), status: 500
  end


  def destroy
    action = Action.find(params[:id])
    if action.status == "draft"
      action.destroy
      message = "Action deleted successfully"
    else
      action.update(is_archived: true)
      action.update(status: "archived")
      message = "Action archived successfully"
    end
    render json: Result.new(nil, message, true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::destroy")
    render json: Result.new(nil, "Action cannot be archived/deleted", false), status: 500
  end

  def archive
    action = Action.find(params[:id])
    action.update(is_archived: true)
    json_response('Action archived successfully', 200)
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionController#archive")
    json_response('Action archive failed.', 500)
  end

  def publish
    action = Action.find(params[:id])
    action.update(published_at: Time.now, status: "published" )
    json_response('Action published', 200)
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionsController::publish")
    json_response('Action cannot be published', 500)
  end
  
  private

  def actions_strong_params
    permited_params = %i[action_type title status published_at subject icon archived category action_category_id]
    params.require(:p_action).permit(permited_params)
  end

  def actions_recurrence_strong_params
    permited_params = [ :start_on_program_start, :start_after_program_start, :start_after_program_start_value, :start_after_program_start_unit, :repeat, :repeat_value, :repeat_unit, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday, :end_timing, :no_end_date, :end_after_occurences, :occurences, :end_after_program_start, :end_date_value, :end_after_program_start_value, :end_after_program_start_unit, :action_id ]
    params.require(:recurrence).permit(permited_params)
  end
end