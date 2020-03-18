class CreateEncounterBillings < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter_billings do |t|
      t.timestamps
      t.references :patient, null: false, foreign_key: {to_table: 'users'}
      t.string :encounter_type
      t.date :day_of_encounter
      t.string :place_of_service
      t.string :status
      t.boolean :generate_claim
    end
  end
end
