namespace :remove_orphaned_data do
  desc "Rake task to remove orphaned autmoation"
  task automation: :environment do
    include LogHelper

    log_info("Deleting orphaned automation data...")
    orphaned_automations = ActionStepAutomation.where(action_step_id: nil)
    orphaned_automation_ids = orphaned_automations.ids
    orphaned_automations.destroy_all
    log_info("Deleting orphaned automation data with ids #{orphaned_automation_ids}")
  end

  desc "Rake task to remove orphaned quick launches"
  task quick_launch: :environment do
    include LogHelper
    
    log_info("Deleting orphaned quick launches data...")
    orphaned_qls = ActionStepQuickLaunch.where(action_step_id: nil)
    orphaned_ql_ids = orphaned_qls.ids
    orphaned_qls.destroy_all
    log_info("Deleting orphaned quick launches data with ids #{orphaned_ql_ids}")
  end
end
