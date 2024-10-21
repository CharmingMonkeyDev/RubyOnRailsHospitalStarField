# frozen_string_literal: true

class CreateWeightReadings < ActiveRecord::Migration[6.0]
  def change
    create_table :weight_readings do |t|
      t.datetime :date_recorded
      t.string :reading_value
      t.text :notes
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
