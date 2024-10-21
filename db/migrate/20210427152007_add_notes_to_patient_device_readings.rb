# frozen_string_literal: true

class AddNotesToPatientDeviceReadings < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_device_readings, :notes, :text
  end
end
