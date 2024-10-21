class UpdateColumnsForCompanyActionSettings < ActiveRecord::Migration[6.0]
  def change
    remove_column :company_action_settings, :global_incomplete_action_days
    remove_column :company_action_settings, :patient_incomplete_action_days
    rename_column :company_action_settings, :global_complete_action_future_days, :global_action_future_days
    rename_column :company_action_settings, :global_complete_action_past_days, :global_action_past_days
    rename_column :company_action_settings, :patient_complete_action_future_days, :patient_action_future_days
    rename_column :company_action_settings, :patient_complete_action_past_days, :patient_action_past_days
  end
end
