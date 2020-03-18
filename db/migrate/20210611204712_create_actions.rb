# frozen_string_literal: true

class CreateActions < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_actions do |t|
      t.references :action_category, null: false, foreign_key: true
      t.text :text
      t.text :subtext
      t.boolean :recurring

      t.timestamps
    end
  end
end
