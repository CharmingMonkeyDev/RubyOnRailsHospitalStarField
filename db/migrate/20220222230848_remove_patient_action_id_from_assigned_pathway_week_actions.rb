class RemovePatientActionIdFromAssignedPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    remove_column :assigned_pathway_week_actions, :patient_action_id
  end
end
