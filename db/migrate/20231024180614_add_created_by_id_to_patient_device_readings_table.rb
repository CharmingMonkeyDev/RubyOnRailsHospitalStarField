class AddCreatedByIdToPatientDeviceReadingsTable < ActiveRecord::Migration[6.0]
  def change
    add_reference :patient_device_readings, :created_by, foreign_key: { to_table: :users}, null: true
  end
end
