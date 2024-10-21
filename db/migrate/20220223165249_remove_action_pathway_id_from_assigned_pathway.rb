class RemoveActionPathwayIdFromAssignedPathway < ActiveRecord::Migration[6.0]
  def change
    remove_column :assigned_pathways, :action_pathway_id
  end
end
