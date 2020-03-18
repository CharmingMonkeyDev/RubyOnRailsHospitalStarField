class CreateActionStepQuickLaunches < ActiveRecord::Migration[6.0]
  def change
    create_table :action_step_quick_launches do |t|
      t.string  :launch_type
      t.references :action_step, null: true, foreign_key: true
      t.references :questionnaire, null: true, foreign_key: true

      t.timestamps
    end
  end
end
