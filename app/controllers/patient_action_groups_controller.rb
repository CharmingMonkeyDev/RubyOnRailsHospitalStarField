# frozen_string_literal: true

class PatientActionGroupsController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def create
    group = PatientActionGroup.create!(patient_action_groups_strong_params)
    log_info("User ID #{current_user&.id} created PatientActionGroup ID #{group&.id}  --PatientActionGroupsController::create")
    patient_actions_strong_params[:selected_actions]&.split(',')&.each do |action_id|
      patient_action = PatientAction.find(action_id.to_i)
      group.patient_action_group_actions.create!(text: patient_action.text, subtext: patient_action.subtext, recurring: patient_action.recurring)
    end

    flash[:notice] = "The group has been created: #{group.name}"
    log_info("User ID #{current_user&.id} accessed PatientActionGroup ID #{group&.id}  --PatientActionGroupsController::create")
    json_response('Group has been created', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    group = PatientActionGroup.find_by_id(params[:id])
    group.update!(patient_action_groups_strong_params)
    log_info("User ID #{current_user&.id} updated PatientActionGroup ID  #{group&.id}  --PatientActionGroupsController::update")

    # reset selected actions
    group.patient_action_group_actions.destroy_all
    patient_actions_strong_params[:selected_actions]&.split(',')&.each do |action_id|
      patient_action = PatientAction.find(action_id)
      group.patient_action_group_actions.create!(text: patient_action.text, subtext: patient_action.subtext, recurring: patient_action.recurring)
    end

    flash[:notice] = 'The group has been updated'
    json_response('Group has been updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    group = PatientActionGroup.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed PatientActionGroup ID  #{group&.id}  --PatientActionGroupsController::destroy")
    group.destroy

    flash[:notice] = 'The group has been removed'
    json_response('Group has been removed', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def patient_action_groups_strong_params
    permited_params = %i[name icon customer_id selected_actions]
    params.require(:patient_action_group).permit(permited_params)
  end

  def patient_actions_strong_params
    permited_params = %i[selected_actions]
    params.require(:patient_actions).permit(permited_params)
  end
end
