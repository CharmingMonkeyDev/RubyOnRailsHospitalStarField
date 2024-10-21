class ChangeAssignedProviderActionsTableColumns < ActiveRecord::Migration[6.0]
  def change
    change_column_default :assigned_provider_actions, :status, "active"
    remove_column :assigned_provider_actions, :patient_program_id
  end
end
