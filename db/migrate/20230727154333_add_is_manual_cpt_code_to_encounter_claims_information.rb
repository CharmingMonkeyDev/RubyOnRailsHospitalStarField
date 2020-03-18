class AddIsManualCptCodeToEncounterClaimsInformation < ActiveRecord::Migration[6.0]
  def change
    add_column :encounter_claim_informations, :is_manual_cpt_code, :boolean, default: false
  end
end
