# frozen_string_literal: true

class AddCompletedAtToAssignedPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_pathway_week_actions, :completed_at, :datetime
  end
end
