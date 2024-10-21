# frozen_string_literal: true

class AssignedPathwayWeeksController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection
  include JsonHelper

  def update
    assigned_pathway_week = AssignedPathwayWeek.find_by_id(params[:id])
    assigned_pathway_week.update!(assigned_pathway_week_strong_params)

    flash[:notice] = "The assigned pathway week has been updated: #{assigned_pathway_week.name}"
    log_info("User ID #{current_user&.id} update AssignedPathwayWeek ID #{assigned_pathway_week&.id} -- AssignedPathwayWeeksController::update")
    json_response('The assigned pathway week has been updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def assigned_pathway_week_strong_params
    permited_params = %i[start_date]
    params.require(:assigned_pathway_week).permit(permited_params)
  end
end
