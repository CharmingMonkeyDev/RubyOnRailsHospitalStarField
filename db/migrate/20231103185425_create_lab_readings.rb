class CreateLabReadings < ActiveRecord::Migration[6.0]
  def change
    create_table :lab_readings do |t|
      t.string :reading_type, null: false
      t.string :reading_value, null: false
      t.datetime :date_recorded, null: false
      t.references :user, :created_by, foreign_key: { to_table: :users}, null: false
      t.text :notes
      
      t.timestamps
    end
  end
end
