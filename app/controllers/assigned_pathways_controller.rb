# frozen_string_literal: true

class AssignedPathwaysController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def create
    assigned_pathway = AssignedPathway.create!(assigned_pathway_strong_params)
    log_info("User ID #{current_user&.id} created AssignedPathway ID #{assigned_pathway&.id} -- AssignedPathwaysController::create")
    # create assigned pathway weeks
    week_count = 0
    params.dig(:assigned_pathway_weeks, :pathway_weeks).each do |pathway_week|
      start_date = assigned_pathway.start_date
      start_date = (start_date + week_count.week) if week_count.positive?
      week_count += 1

      assigned_pathway_week = assigned_pathway.assigned_pathway_weeks.create!(name: pathway_week['name'],
                                                                              start_date: start_date)
      # create assigned pathway week actions
      pathway_week['action_pathway_week_actions'].each do |action|
        assigned_pathway_week.assigned_pathway_week_actions.create!(
          text: action.dig("text"),
          subtext: action.dig("subtext"),
          recurring: action.dig("recurring"),
          status: "unassigned",
          source: "care_plan"
        )
      end
    end

    log_info("User ID #{current_user&.id} accessed UserObject ID #{assigned_pathway_strong_params[:user_id]} -- AssignedPathwaysController::create")
    json_data_response({ patient: User.find_by_id(assigned_pathway_strong_params[:user_id]).custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    assigned_pathway = AssignedPathway.find_by_id(params[:id])
    assigned_pathway.update!(assigned_pathway_strong_params)
    log_info("User ID #{current_user&.id} updated AssignedPathway ID #{assigned_pathway&.id} -- AssignedPathwaysController::update")
    if assigned_pathway_strong_params[:start_date].present?
      week_count = 0
      assigned_pathway.assigned_pathway_weeks.each do |week|
        start_date = assigned_pathway.start_date
        start_date = (start_date + week_count.week) if week_count.positive?
        week.update!(start_date: start_date)
        week_count += 1
      end
    end

    flash[:notice] = 'The assigned pathway has been updated'
    log_info("User ID #{current_user&.id} accessed AssignedPathway ID #{assigned_pathway&.id} -- AssignedPathwaysController::update")
    json_data_response({ assigned_pathway: assigned_pathway })
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    assigned_pathway = AssignedPathway.find_by_id(params[:id])
    patient = assigned_pathway.user
    log_info("User ID #{current_user&.id} destroyed AssignedPathway ID #{assigned_pathway&.id} -- AssignedPathwaysController::destroy")
    assigned_pathway.destroy

    log_info("User ID #{current_user&.id} access User Object #{patient&.id} -- AssignedPathwaysController::destroy")
    json_data_response({ patient: patient.custom_json(:care_plan_management) })
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def assigned_pathway_strong_params
    permited_params = %i[user_id name start_date action_pathway_id]
    params.require(:assigned_pathway).permit(permited_params)
  end
end
