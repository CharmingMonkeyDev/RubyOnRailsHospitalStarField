class CreateJoinTableAssignedPathwayWeekActionResourceItem < ActiveRecord::Migration[6.0]
  def change
    create_join_table :assigned_pathway_week_actions, :resource_items do |t|
      t.index [:assigned_pathway_week_action_id, :resource_item_id], name: 'index_apwa_resource_on_apwa_id_and_resource_id'
      t.index [:resource_item_id, :assigned_pathway_week_action_id], name: 'index_apwa_resource_on_resource_id_and_apwa_id'
    end
  end
end
