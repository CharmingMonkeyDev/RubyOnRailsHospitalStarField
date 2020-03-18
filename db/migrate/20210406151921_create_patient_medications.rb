# frozen_string_literal: true

class CreatePatientMedications < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_medications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :value

      t.timestamps
    end
  end
end
