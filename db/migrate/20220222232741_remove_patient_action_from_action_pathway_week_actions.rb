class RemovePatientActionFromActionPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    remove_column :action_pathway_week_actions, :patient_action_id
  end
end
