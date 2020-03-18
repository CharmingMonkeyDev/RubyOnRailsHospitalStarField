class AddActionPathwayIdToAssignedPathways < ActiveRecord::Migration[6.0]
  def change
    add_reference :assigned_pathways, :action_pathway, null: true, foreign_key: true
  end
end
