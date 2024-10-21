class CreateEncounterInsuranceInformations < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter_insurance_informations do |t|
      t.timestamps
      t.references :encounter_billing, null: false, foreign_key: true
      t.string :insurance_type
      t.string :relationship
      t.string :plan_name
      t.string :insured_id
      t.string :insured_name
      t.datetime :insured_dob
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.string :insured_phone_number
      t.string :feca_number
      t.string :insured_sex
      t.string :other_claim_id
      t.string :medicare_plan_name
      t.boolean :another_benefit_plan_present
    end
  end
end
