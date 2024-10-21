# frozen_string_literal: true

class CreateBloodPressureReadings < ActiveRecord::Migration[6.0]
  def change
    create_table :blood_pressure_readings do |t|
      t.datetime :date_recorded
      t.string :systolic_value
      t.string :diastolic_value
      t.text :notes
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
