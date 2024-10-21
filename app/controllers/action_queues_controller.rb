class ActionQueuesController < ApplicationController
  include JsonHelper

  def assign_to_provider
    current_customer = current_user.customer_selection.customer
    aq = ActionQueue.joins(:action)
                    .where(id: params[:id])
                    .where("actions.customer_id = ?", current_customer.id)
                    .first

    if params[:assign_to_me].to_i == 1
      aq.update(assigned_to_id: current_user.id)
      user = current_user
    else
      aq.update(assigned_to_id: params[:provider_id])
      user = User.find(params[:provider_id])
    end

    aq.action_queue_histories.create(
      user: current_user,
      history_type: "Action",
      description: "Action Assigned to #{user.last_name}, #{user.first_name}",
    )
    render json: Result.new(nil, "Action Assigned to the provider", true), status: 200
  rescue StandardError => e
      Rollbar.warning("Error assigning action to the provider#{e} ----DataFetching::ActionQueuesController::assign_to_provider")
      json_response(e, 500)
  end

  def unassign
      current_customer = current_user.customer_selection.customer

      aq = ActionQueue.joins(:action)
                      .where(id: params[:id])
                      .where("actions.customer_id = ?", current_customer.id)
                      .first

      aq.action_queue_histories.create(
        user: current_user,
        history_type: "Action",
        description: "Action Unassigned from #{aq.provider&.last_name}, #{aq.provider&.first_name}",
      )
      aq.update(assigned_to_id: nil)
      render json: Result.new(nil, "Action Unassigned", true), status: 200
  rescue StandardError => e
      Rollbar.warning("Error unassigning action #{e} ----DataFetching::ActionQueuesController::unassign")
      json_response(e, 500)
  end
end
