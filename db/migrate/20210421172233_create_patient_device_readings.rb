# frozen_string_literal: true

class CreatePatientDeviceReadings < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_device_readings do |t|
      t.references :patient_device, null: false, foreign_key: true
      t.string :reading_type
      t.string :reading_value
      t.string :reading_id
      t.datetime :date_recorded

      t.timestamps
    end
  end
end
