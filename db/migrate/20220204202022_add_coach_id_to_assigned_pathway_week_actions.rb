class AddCoachIdToAssignedPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_pathway_week_actions, :assigned_coach_id, :integer
  end
end
