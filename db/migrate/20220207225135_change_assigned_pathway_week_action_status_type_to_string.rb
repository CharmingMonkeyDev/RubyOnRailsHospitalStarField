class ChangeAssignedPathwayWeekActionStatusTypeToString < ActiveRecord::Migration[6.0]
  def change
    change_column :assigned_pathway_week_actions, :status, :string
  end
end
