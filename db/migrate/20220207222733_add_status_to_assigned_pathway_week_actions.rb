class AddStatusToAssignedPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_pathway_week_actions, :status, :integer, default: "unassigned"
  end
end
