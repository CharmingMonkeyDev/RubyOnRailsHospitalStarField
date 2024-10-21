# frozen_string_literal: true

class ActionPathwaysController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def create
    pathway = ActionPathway.create!(action_pathways_strong_params)

    start = 0
    weeks = action_pathway_weeks_strong_params[:weeks]

    while start < weeks
      start += 1
      pathway.action_pathway_weeks.create!(name: "Week #{start}")
    end

    flash[:notice] = "The pathway has been created: #{pathway.name}"
    log_info("User ID #{current_user&.id} created ActionPathway ID #{pathway&.id} -- ActionPathwaysController::create")
    json_response('Pathway has been created', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    pathway = ActionPathway.find_by_id(params[:id])
    pathway.update!(action_pathways_strong_params)

    start = pathway.action_pathway_weeks.count
    weeks = action_pathway_weeks_strong_params[:weeks]
    while start < weeks
      start += 1
      pathway.action_pathway_weeks.create!(name: "Week #{start}")
    end

    flash[:notice] = 'The pathway has been updated'
    log_info("User ID #{current_user&.id} updated ActionPathway ID #{pathway&.id} -- ActionPathwaysController::update")
    json_response('Pathway has been updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def destroy
    pathway = ActionPathway.find_by_id(params[:id])
    log_info("User ID #{current_user&.id} destroyed ActionPathway ID #{pathway&.id} -- ActionPathwaysController::destroy")
    pathway.destroy

    flash[:notice] = 'The pathway has been removed'
    json_response('Pathway has been removed', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def action_pathways_strong_params
    permited_params = %i[name customer_id]
    params.require(:action_pathway).permit(permited_params)
  end

  def action_pathway_weeks_strong_params
    permited_params = %i[weeks]
    params.require(:action_pathways_weeks).permit(permited_params)
  end
end
