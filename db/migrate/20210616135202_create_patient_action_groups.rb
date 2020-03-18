# frozen_string_literal: true

class CreatePatientActionGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_action_groups do |t|
      t.string :name
      t.references :pharmacy_group, null: false, foreign_key: true
      t.string :icon

      t.timestamps
    end
  end
end
