class RemovePatientActionIdFromPatientActionGroupActions < ActiveRecord::Migration[6.0]
  def change
    remove_column :patient_action_group_actions, :patient_action_id
  end
end
