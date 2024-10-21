class CreatePatientInstructions < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_instructions do |t|
      t.timestamps
      t.string :notes, default: ""
      t.references :creator, null: false, foreign_key: {to_table: 'users'}
      t.references :encounter_billing, null: false, foreign_key: {to_table: 'encounter_billings'}
    end
  end
end
