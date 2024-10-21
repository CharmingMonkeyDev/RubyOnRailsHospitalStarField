class CreateAdtPatientNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :adt_patient_notifications do |t|
      t.references :user, null: true, foreign_key: true
      t.references :adt_inbound_notification, null: false, foreign_key: true
      t.string :message_control_id
      t.datetime :event_date
      t.string :event_type
      t.string :patient_class
      t.string :facility_name
      t.string :diagnosis
      t.timestamps
    end
  end
end
