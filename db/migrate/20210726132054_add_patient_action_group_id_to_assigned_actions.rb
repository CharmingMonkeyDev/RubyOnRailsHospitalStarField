# frozen_string_literal: true

class AddPatientActionGroupIdToAssignedActions < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_actions, :patient_action_group_id, :integer
  end
end
