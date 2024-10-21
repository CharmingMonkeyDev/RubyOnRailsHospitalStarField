# frozen_string_literal: true

class AddSourceToPatientDeviceReadings < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_device_readings, :source, :string
  end
end
