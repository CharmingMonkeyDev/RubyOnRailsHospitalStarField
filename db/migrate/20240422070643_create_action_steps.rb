class CreateActionSteps < ActiveRecord::Migration[6.0]
  def change
    create_table :action_steps do |t|
      t.string :title
      t.string :subtext
      t.string :icon
      t.references :action

      t.timestamps
    end
  end
end