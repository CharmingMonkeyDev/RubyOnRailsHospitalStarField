class AddColumnsToPatientActionGroupActions < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_action_group_actions, :text, :string
    add_column :patient_action_group_actions, :subtext, :string
    add_column :patient_action_group_actions, :recurring, :boolean
  end
end
