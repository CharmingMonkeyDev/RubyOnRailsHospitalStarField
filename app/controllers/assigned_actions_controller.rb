# frozen_string_literal: true

class AssignedActionsController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def patient_assigned_actions
    patient = User.find(params[:patient_id])
    assigned_actions = patient.assigned_actions
    log_info("User ID #{current_user&.id} accessed patient_assigned_actions for patient #{patient&.id} --AssignedActionsController#patient_assigned_actions")
    render json: Result.new(assigned_actions, "patient assigned action fetched", true), status: 200
    rescue StandardError => e
      Rollbar.warning("Error: #{e} --AssignedActionsController#patient_assigned_actions")
      render json: Result.new(nil, e, false), status: 500
  end

  def provider_assigned_actions
    patient = User.find(params[:patient_id])
    assigned_pathway_ids = patient.assigned_pathways.pluck(:id)
    active_assigned_pathway_week_ids = AssignedPathwayWeek.where("DATE(start_date) >= ? and DATE(Start_date) <= ? ",Date.today.beginning_of_week, Date.today.end_of_week).where(assigned_pathway_id: assigned_pathway_ids).pluck(:id)
    assigned_pathway_week_actions = AssignedPathwayWeekAction.where(assigned_pathway_week_id: active_assigned_pathway_week_ids).where.not(status: ['dismissed', 'complete']).where("deferred_until IS NULL OR deferred_until <= ?", Date.today)

    log_info("User ID #{current_user&.id} accessed provider actions for patient #{patient&.id} --AssignedActionsController#provider_assigned_actions")
    render json: Result.new(assigned_pathway_week_actions, "provider assigned action fetched", true), status: 200
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --AssignedActionsController#provider_assigned_actions")
    render json: Result.new(nil, e, false), status: 500
  end

  def create
    assigned_action = AssignedAction.create!(assigned_action_strong_params)
    patient_action = PatientAction.find(params[:assigned_action][:action_id])
    if patient_action.action_resources.present?
      patient_action.action_resources.each do |resource|
        assigned_action.assigned_action_resources.create(resource_item_id: resource.resource_item_id)
      end
    end
    log_info("User ID #{current_user&.id} created AssignedAction ID #{assigned_action&.id} -- AssignedActionsController::create")
    json_data_response({ patient: User.find_by_id(assigned_action_strong_params[:user_id]).custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    assigned_action = AssignedAction.find_by_id(params[:id])
    assigned_action.update!(completed_at: params[:assigned_action][:completed_at])
    log_info("User ID #{current_user&.id} updated AssignedAction ID #{assigned_action&.id} -- AssignedActionsController::updated")
    json_data_response({ patient: User.find_by_id(current_user.id).custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    assigned_action = AssignedAction.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed AssignedAction ID #{assigned_action&.id} -- AssignedActionsController::destroy")
    patient = assigned_action.user
    assigned_action.destroy

    json_data_response({ patient: patient.custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def assigned_action_strong_params
    permited_params = %i[user_id text subtext recurring patient_action_group_id ]
    params.require(:assigned_action).permit(permited_params)
  end
end
