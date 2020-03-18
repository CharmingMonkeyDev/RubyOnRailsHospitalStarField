class RemovePatientActionFromAssignedActions < ActiveRecord::Migration[6.0]
  def change
    remove_column :assigned_actions, :patient_action_id
  end
end
