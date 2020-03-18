# frozen_string_literal: true

class PatientActionsController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def create
    action = PatientAction.create!(patient_actions_strong_params)
    log_info("User ID #{current_user&.id} created PatientAction ID #{action.id}  -- PatientActionsController::create")
    if params[:action_resource_items].length.positive?
      params[:action_resource_items].each do |action_resource_item|
        action.action_resources.create!(
          resource_item_id: action_resource_item[:id]
        )
      end
    end

    flash[:notice] = "The action has been created: #{action.text}"
    log_info("User ID #{current_user&.id} accessed PatientAction ID #{action&.id}  -- PatientActionsController::create")
    json_data_response({ patient_action: action })
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    action = PatientAction.find_by_id(params[:id])
    action.update!(patient_actions_strong_params)
    log_info("User ID #{current_user&.id} updated PatientAction ID #{action&.id}  -- PatientActionsController::update")

    flash[:notice] = 'The action has been updated'
    log_info("User ID #{current_user&.id} accessed PatientAction ID  #{action&.id}  -- PatientActionsController::update")
    json_data_response({ patient_action: action })
  rescue StandardError => e
    json_response(e, 500)
  end

  def show
    action = PatientAction.find(params[:id])
    log_info("User ID #{current_user&.id} accessed PatientAction ID #{action&.id}  -- PatientActionsController::show")
    json_data_response({ patient_action: action })
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    action = PatientAction.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed PatientAction ID #{action&.id}  -- PatientActionsController::destroy")
    action.destroy

    flash[:notice] = 'The action has been removed'
    json_response('Action has been removed', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def patient_actions_strong_params
    permited_params = %i[text subtext action_category_id icon recurring customer_id]
    params.require(:patient_action).permit(permited_params)
  end
end
