class AddColumnsToActionPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    add_column :action_pathway_week_actions, :text, :string
    add_column :action_pathway_week_actions, :subtext, :string
    add_column :action_pathway_week_actions, :recurring, :boolean
  end
end
