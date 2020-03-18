class CreateActionQueueHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :action_queue_histories do |t|
      t.references :action_queue, null: false
      t.references :user, foreign_key: { to_table: :users }, index: true, null: true
      t.string :history_type
      t.text :description

      t.timestamps
    end
  end
end
