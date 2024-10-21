class CreateGlucoseReadings < ActiveRecord::Migration[6.0]
  def change
    create_table :glucose_readings do |t|
      t.references :synced_account, null: false, foreign_key: true
      t.datetime :system_time
      t.datetime :display_time
      t.string :egv_value
      t.string :real_time_value
      t.string :smoothed_value
      t.string :status
      t.string :trend
      t.string :trend_rate
      t.timestamps
    end
  end
end
