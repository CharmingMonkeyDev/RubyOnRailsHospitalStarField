# frozen_string_literal: true

class AddCompletedAtToAssignedActions < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_actions, :completed_at, :datetime
  end
end
