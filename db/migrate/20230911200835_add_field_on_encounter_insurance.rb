class AddFieldOnEncounterInsurance < ActiveRecord::Migration[6.0]
  def change
    add_column :encounter_insurance_informations, :service_partner_id, :string
    add_column :encounter_insurance_informations, :claim_filing_code, :string
  end
end
