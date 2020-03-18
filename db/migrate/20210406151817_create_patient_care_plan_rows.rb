# frozen_string_literal: true

class CreatePatientCarePlanRows < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_care_plan_rows do |t|
      t.references :user, null: false, foreign_key: true
      t.text :value

      t.timestamps
    end
  end
end
