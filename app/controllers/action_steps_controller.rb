class ActionStepsController < ApplicationController
  include JsonHelper

  def index
    action_steps = ActionStep.where(action_id: params[:action_id])
    json_data_response({ action_step: action_steps })
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepsController::index")
    json_response(e, 500)
  end

  def create
    resource_ids = params[:resource_ids]
    quick_launch_ids = params[:quick_launch_ids]
    automation_ids = params[:automation_ids]
    action_step = nil

    ActiveRecord::Base.transaction do
      action_step = ActionStep.create!(action_steps_strong_params)
      
      if resource_ids
        resource_ids.each do |resource_id|
            ActionStepResource.create(action_step_id: action_step.id, resource_item_id: resource_id)
        end
      end

      if quick_launch_ids
        quick_launch_ids.each do |quick_launch_id|
          ActionStepQuickLaunch.find(quick_launch_id).update(action_step: action_step)
        end
      end

      if automation_ids
        automation_ids.each do |automation_id|
          ActionStepAutomation.find(automation_id).update(action_step: action_step)
        end
      end
    end

    log_info("User ID #{current_user&.id} created ActionStep ID #{action_step.id}  -- ActionStepsController::create")

    flash[:notice] = "The action step has been created: #{action_step.title}"
    log_info("User ID #{current_user&.id} accessed ActionStep ID #{action_step&.id}  -- ActionStepsController::create")
    render json: Result.new(action_step, "Action Step Created", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepsController::create")
    render json: Result.new(nil, "Action Step cannot be created.", false), status: 500
  end

  def show
    action_step = ActionStep.find(params[:id])
    log_info("User ID #{current_user&.id} accessed ActionStep ID #{action_step&.id}  -- ActionStepsController::show")
    render json: Result.new(action_step, "Action Step fethced", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepsController::show")
    render json: Result.new(nil, "Action Step cannot be fetched.", false), status: 500
  end

  def update
    action_step = ActionStep.find_by_id(params[:id])
    action_step.update!(action_steps_strong_params)

    resource_ids = params[:resource_ids]
    existing_asr_ids = action_step.action_step_resources.ids
    to_keep_action_asr_ids = []

    quick_launch_ids = params[:quick_launch_ids] || []
    current_ql_ids = action_step.action_step_quick_launches.ids
    ql_to_remove = current_ql_ids - quick_launch_ids
    ql_to_add = quick_launch_ids - current_ql_ids

    automation_ids = params[:automation_ids] || []
    current_automation_ids = action_step.action_step_automations.ids
    automations_to_remove = current_automation_ids - automation_ids
    automation_to_add = automation_ids - current_automation_ids

    ActiveRecord::Base.transaction do
      resource_ids.each do |resource_id|
        ar = ActionStepResource.where(action_step_id: action_step.id, resource_item_id: resource_id).first
        if !ar 
            ar = ActionStepResource.create(action_step_id: action_step.id, resource_item_id: resource_id)
        end
        to_keep_action_asr_ids << ar.id
      end
      to_remove_asr_ids = existing_asr_ids - to_keep_action_asr_ids
      ActionStepResource.where(id: to_remove_asr_ids).destroy_all

      action_step.action_step_quick_launches.where(id: ql_to_remove).destroy_all
      ql_to_add.each do |ql_id|
        ActionStepQuickLaunch.find(ql_id).update(action_step: action_step)
      end

      action_step.action_step_automations.where(id: automations_to_remove).destroy_all
      automation_to_add.each do |automation_id|
        ActionStepAutomation.find(automation_id).update(action_step: action_step)
      end
    end
    
    log_info("User ID #{current_user&.id} updated ActionStep ID #{action_step&.id}  -- ActionStepsController::update")

    flash[:notice] = 'The action step has been updated'
    log_info("User ID #{current_user&.id} accessed ActionStep ID  #{action_step&.id}  -- ActionStepsController::update")
    render json: Result.new(action_step, "Action Step Updated", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepsController::update")
    render json: Result.new(nil, "Action Step cannot be updated", false), status: 500
  end

  def destroy
    action_step = ActionStep.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed ActionStep ID #{action_step&.id}  -- ActionStepsController::destroy")
    action_step.destroy

    flash[:notice] = 'The action step has been removed'
    json_response('Action step has been removed', 200)
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --ActionStepsController::destroy")
    json_response(e, 500)
  end

  private

  def action_steps_strong_params
    permited_params = %i[ title subtext icon action_id ]
    params.require(:action_step).permit(permited_params)
  end
end