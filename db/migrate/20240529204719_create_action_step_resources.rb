class CreateActionStepResources < ActiveRecord::Migration[6.0]
  def change
    create_table :action_step_resources do |t|
      t.references :action_step, null: false, foreign_key: true
      t.references :resource_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
