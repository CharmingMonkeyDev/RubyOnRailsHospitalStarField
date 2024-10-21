class CreateAssignedActionResources < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_action_resources do |t|
      t.references :assigned_action, null: false, foreign_key: true
      t.references :resource_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
