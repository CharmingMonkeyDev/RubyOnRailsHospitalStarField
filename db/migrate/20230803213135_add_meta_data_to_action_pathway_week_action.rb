class AddMetaDataToActionPathwayWeekAction < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_pathway_week_actions, :deferred_at, :datetime
    add_column :assigned_pathway_week_actions, :dismissed_at, :datetime
    add_column :assigned_pathway_week_actions, :deferred_until, :datetime
  end
end
