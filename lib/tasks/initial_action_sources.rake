# frozen_string_literal: true

namespace :initial_action_sources do
  desc "Update action sources for existing actions"
  task update: :environment do
    actions = AssignedPathwayWeekAction.where(source: nil)

    actions.each do |action|
      if action.text == "Patient Discharged"
        action.update!(source: "adt_discharge")
      else
        action.update!(source: "care_plan")
      end
    end
  end
end
