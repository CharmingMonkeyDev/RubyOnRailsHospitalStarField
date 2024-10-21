# frozen_string_literal: true

class CreatePatientActionGroupActions < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_action_group_actions do |t|
      t.references :patient_action_group, null: false, foreign_key: true
      t.references :patient_action, null: false, foreign_key: true

      t.timestamps
    end
  end
end
