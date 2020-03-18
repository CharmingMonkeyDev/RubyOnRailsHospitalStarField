# frozen_string_literal: true

class ActionResourcesController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def show
    patient_action = PatientAction.find(params[:id])
    resource_item_ids = patient_action.action_resources.pluck(:resource_item_id)
    resource_items = ResourceItem.where(id: resource_item_ids)
    log_info("User ID #{current_user&.id} accessed ResourceItems IDs #{resource_item_ids} and PatientAction ID #{patient_action&.id} -- ActionResourcesController::show")
    json_data_response({ action_resource_items: resource_items })
  rescue StandardError => e
    json_response(e, 500)
  end

  def create
    action_resource = ActionResource.create!(action_resources_strong_params)

    flash[:notice] = 'The action resource has been created'
    log_info("User ID #{current_user&.id} accessed ActionResource ID #{action_resource&.id} -- ActionResourcesController::create")
    json_data_response({ patient_action: action_resource.patient_action })
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    action_resource = ActionResource.find(params[:id])
    log_info("User ID #{current_user&.id} destroy ActionResource ID  #{action_resource&.id} -- ActionResourcesController::destroy")
    patient_action = action_resource.patient_action
    action_resource.destroy

    flash[:notice] = 'The action resource has been removed'
    json_data_response({ patient_action: patient_action })
  rescue StandardError => e
    json_response(e, 500)
  end

  def action_resources_remove
    action_resource = ActionResource.where(resource_item_id: action_resources_strong_params[:resource_item_id],
                                           patient_action_id: action_resources_strong_params[:patient_action_id]).first

    if action_resource
      patient_action = action_resource.patient_action
      log_info("User ID #{current_user&.id} destroy PatientAction ID  #{action_resource&.id} -- ActionResourcesController::action_resources_remove")
      action_resource.destroy
      resource_item_ids = patient_action.action_resources.pluck(:resource_item_id)
      resource_items = ResourceItem.where(id: resource_item_ids)
    end

    flash[:notice] = 'The action resource has been removed'
    log_info("User ID #{current_user&.id} access ResourceItesm  #{resource_item_ids} -- ActionResourcesController::action_resources_remove")
    json_data_response({ action_resource_items: resource_items })
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def action_resources_strong_params
    permited_params = %i[patient_action_id resource_item_id]
    params.require(:action_resource).permit(permited_params)
  end
end
