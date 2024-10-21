namespace :generate do
  task recurring_task: :environment do

    recurring_actions = RecurringAction.all
    recurring_actions.each do |recurring_action|
        if recurring_action.actionable_type == "AssignedAction"
            assigned_action = AssignedAction.find(recurring_action.actionable_id)
            AssignedAction.create(
                text: assigned_action.text,
                subtext: assigned_action.subtext,
                recurring: assigned_action.recurring,
                user_id: assigned_action.user_id,
                patient_action_group_id: assigned_action.patient_action_group_id,
                creation_type: "system_creation"
            )
        else
            provider_action = AssignedPathwayWeekAction.find(recurring_action.actionable_id)
            if provider_action.assigned_pathway_week&.start_date <= Date.today + 7.days && provider_action.assigned_pathway_week&.start_date >= Date.today
                AssignedPathwayWeekAction.create(
                    assigned_pathway_week_id: provider_action.assigned_pathway_week_id,
                    text: provider_action.text,
                    subtext: provider_action.subtext,
                    recurring: provider_action.recurring,
                    assigned_coach_id: provider_action.assigned_coach_id,
                    status: provider_action.status,
                    source: provider_action.source || "",
                    creation_type: "system_creation"
                )
            end
        end
    end
    
  end
end
