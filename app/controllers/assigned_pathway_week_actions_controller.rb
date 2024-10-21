# frozen_string_literal: true

class AssignedPathwayWeekActionsController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def create
    assigned_pathway_week_action = AssignedPathwayWeekAction.create!(assigned_pathway_week_id: assigned_pathway_week_action_strong_params[:assigned_pathway_week_id])
    patient_action = PatientAction.find(assigned_pathway_week_action_strong_params[:patient_action_id])
    assigned_pathway_week_action.update!(
      text: patient_action.text,
      subtext: patient_action.subtext,
      recurring: patient_action.recurring,
      source: "care_plan",
      status: "unassigned"
    )
    patient = assigned_pathway_week_action.assigned_pathway_week.assigned_pathway.user
    log_info("User ID #{current_user&.id} created AssignedPathwayWeekAction ID #{assigned_pathway_week_action&.id} -- AssignedPathwayWeekActionsController::create")
    log_info("User ID #{current_user&.id} accessed UserObject ID #{patient&.id} -- AssignedPathwayWeekActionsController::create")
    json_data_response({ patient: patient.custom_json(:care_plan_management) })
  end

  def destroy
    assigned_pathway_week_action = AssignedPathwayWeekAction.find_by_id(params[:id])
    patient = assigned_pathway_week_action.assigned_pathway_week.assigned_pathway.user
    log_info("User ID #{current_user&.id} destroyed AssignedPathwayWeekAction ID #{assigned_pathway_week_action&.id} -- AssignedPathwayWeekActionsController::destroy")
    assigned_pathway_week_action.destroy
    log_info("User ID #{current_user&.id} accessed UserObject ID #{patient&.id} -- AssignedPathwayWeekActionsController::destroy")
    json_data_response({ patient: patient.custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    assigned_pathway_week_action = AssignedPathwayWeekAction.find_by_id(params[:id])
    assigned_pathway_week_action.update!(completed_at: params[:assigned_pathway_week_action][:completed_at])
    log_info("User ID #{current_user&.id} updated AssignedPathwayWeekAction ID #{assigned_pathway_week_action&.id} -- AssignedPathwayWeekActionsController::update")
    json_data_response({ patient: User.find_by_id(assigned_pathway_week_action.assigned_pathway_week.assigned_pathway.user.id).custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  def get_associated_resources
    assigned_pathway_week_action = AssignedPathwayWeekAction.find_by_id(params[:id])
    resource_items = assigned_pathway_week_action.resource_items
    
    render json: Result.new(resource_items, "Data fetched", true), status: 200
  end

  private

  def assgned_pathway_strong_params
    permited_params = %i[action_pathway_id user_id name]
    params.require(:assigned_pathway).permit(permited_params)
  end

  def assigned_pathway_week_action_strong_params
    permited_params = %i[patient_action_id assigned_pathway_week_id]
    params.require(:assigned_pathway_week_action).permit(permited_params)
  end
end
