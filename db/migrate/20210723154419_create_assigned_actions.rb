# frozen_string_literal: true

class CreateAssignedActions < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_actions do |t|
      t.references :patient_action, null: false, foreign_key: true
      t.text :text
      t.text :subtext
      t.boolean :recurring
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
