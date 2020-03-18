class AddCreatedByIdToBloodPressureReadingsTable < ActiveRecord::Migration[6.0]
  def change
    add_reference :blood_pressure_readings, :created_by, foreign_key: { to_table: :users}, null: true
  end
end
