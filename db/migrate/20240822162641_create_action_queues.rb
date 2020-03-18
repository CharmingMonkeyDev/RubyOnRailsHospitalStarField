class CreateActionQueues < ActiveRecord::Migration[6.0]
  def change
    create_table :action_queues do |t|
      t.references :patient, foreign_key: { to_table: :users }, index: true
      t.references :action, foreign_key: { to_table: :actions }, index: true
      t.references :assigned_program, foreign_key: { to_table: :assigned_programs }, index: true, null: true
      t.references :assigned_provider_action, foreign_key: { to_table: :assigned_provider_actions }, index: true, null: true
      t.references :assigned_to, foreign_key: { to_table: :users }, index: true, null: true
      t.date :due_date, null: false
      t.string :status, null: false, default: "incomplete"
      t.timestamps
      t.datetime :deleted_at, null: true
    end
  end
end
