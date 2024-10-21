# frozen_string_literal: true

class ActionPathwayWeekActionsController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def create
    patient_action = PatientAction.find(action_pathway_week_action_strong_params[:patient_action_id])
    action_pathway_week_id = action_pathway_week_action_strong_params[:action_pathway_week_id]
    week_action = ActionPathwayWeekAction.create!(action_pathway_week_id: action_pathway_week_id, text: patient_action.text, subtext: patient_action.subtext, recurring: patient_action.recurring)

    # flash[:notice] = "The action has been added to the pathway: #{week_action.patient_action.text}"
    log_info("User ID #{current_user&.id} creates ActionPathwayWeekAction ID #{week_action&.id} -- ActionPathwayWeekActions::create")
    json_data_response({ pathway_week_actions: current_user.customer_selection.customer.action_pathways })
  rescue StandardError => e
    json_response(e, 500)
  end

  # current_user.customer_selection.customer.action_pathways

  def destroy
    pathway_action = ActionPathwayWeekAction.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroy ActionPathwayWeekAction ID #{pathway_action&.id} -- ActionPathwayWeekActions::destroy")
    pathway_action.destroy

    # flash[:notice] = 'The pathway action has been removed'
    json_data_response({ pathway_week_actions: current_user.customer_selection.customer.action_pathways })
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def action_pathway_week_action_strong_params
    permited_params = %i[patient_action_id action_pathway_week_id]
    params.require(:action_pathway_week_action).permit(permited_params)
  end
end
