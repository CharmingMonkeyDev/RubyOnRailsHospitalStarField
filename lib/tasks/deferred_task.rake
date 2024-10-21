namespace :generate do
  task deferred_task: :environment do

    deferred_actions = AssignedPathwayWeekAction.where(status: "deferred", deferred_until: Date.today)


    deferred_actions.each do |deferred_action|
        provider_action_status = "unassigned"
        if deferred_action&.assigned_coach_id.present?
          provider_action_status = "incomplete"
        end
        
        deferred_actions.update(
          status: provider_action_status,
          deferred_until: nil,
          deferred_at: nil
        )
    end
  end
end