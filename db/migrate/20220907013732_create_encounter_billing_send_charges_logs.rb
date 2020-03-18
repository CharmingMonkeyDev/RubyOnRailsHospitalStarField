class CreateEncounterBillingSendChargesLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :eb_send_charges_logs do |t|
      t.timestamps
      t.references :encounter_billing, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :x12_data
      
    end
  end
end
