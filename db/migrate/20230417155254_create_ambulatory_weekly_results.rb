class CreateAmbulatoryWeeklyResults < ActiveRecord::Migration[6.0]
  def change
    create_table :ambulatory_weekly_results do |t|
      t.json :results
      t.references :user, null: false, foreign_key: true
      t.date :end_date
      t.string :data_type

      t.timestamps
    end
  end
end
