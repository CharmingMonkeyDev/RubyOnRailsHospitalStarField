# frozen_string_literal: true

class CreateActionResources < ActiveRecord::Migration[6.0]
  def change
    create_table :action_resources do |t|
      t.references :patient_action, null: false, foreign_key: true
      t.references :resource_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
