class CreateActionStepAutomations < ActiveRecord::Migration[6.0]
  def change
    create_table :action_step_automations do |t|
      t.string  :automation_type
      t.string  :activity_type, default: 'sending'
      t.references :action_step, null: true, foreign_key: true
      t.references :questionnaire, null: true, foreign_key: true

      t.timestamps
    end
  end
end
