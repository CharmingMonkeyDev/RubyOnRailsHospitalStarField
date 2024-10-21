# frozen_string_literal: true

class CreatePatientDevices < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_devices do |t|
      t.references :user, null: false, foreign_key: true
      t.string :identifier

      t.timestamps
    end
  end
end
