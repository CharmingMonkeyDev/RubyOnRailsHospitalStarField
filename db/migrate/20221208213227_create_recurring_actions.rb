class CreateRecurringActions < ActiveRecord::Migration[6.0]
  def change
    create_table :recurring_actions do |t|
      t.boolean :active
      t.integer :actionable_id
      t.string :actionable_type

      t.timestamps
    end
  end
end
