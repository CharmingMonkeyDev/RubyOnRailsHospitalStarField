class CreateNewActions < ActiveRecord::Migration[6.0]
  def change
    create_table :actions do |t|
      t.integer :action_type
      t.string :title
      t.datetime :published_at
      t.string :subtext
      t.string :icon
      t.boolean :is_archived, default: false
      t.references :action_category, null: false, foreign_key: true
      t.references :customer, foreign_key: true

      t.timestamps
    end
  end
end