# frozen_string_literal: true

class CreatePatientLabs < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_labs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :lab_type
      t.string :value

      t.timestamps
    end
  end
end
