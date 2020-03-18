class CreateEncounterClaimInformations < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter_claim_informations do |t|
      t.timestamps
      t.references :encounter_billing, null: false, foreign_key: true
      t.string :cpt_code
      t.string :diagnosis_code_value
      t.string :diagnosis_code_desc
      t.integer :units
      t.string :charges
      t.string :modifier
      t.string :rendering_provider
    end
  end
end
