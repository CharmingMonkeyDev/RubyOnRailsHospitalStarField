class AddCreationTypeOnAssignedAction < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_actions, :creation_type, :string, default: "user_creation"
    add_column :assigned_pathway_week_actions, :creation_type, :string, default: "user_creation"
  end
end
