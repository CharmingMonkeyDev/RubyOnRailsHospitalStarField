class CreateActionStepQueues < ActiveRecord::Migration[6.0]
  def change
    create_table :action_step_queues do |t|
      t.references :action_queue, null: false, foreign_key: true
      t.references :action_step, null: false, foreign_key: true
      t.string :status, default: "incomplete"

      t.timestamps
    end
  end
end
