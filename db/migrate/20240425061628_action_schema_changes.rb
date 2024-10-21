class ActionSchemaChanges < ActiveRecord::Migration[6.0]
  def change
    rename_column :actions, :subtext, :subject
    add_column :actions, :status, :string
  end
end