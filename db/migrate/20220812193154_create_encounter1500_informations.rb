class CreateEncounter1500Informations < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter1500_informations do |t|
      t.references :encounter_billing, null: false, foreign_key: true
      t.timestamps
      t.boolean :employment_present
      t.boolean :accident_present
      t.string :accident_state
      t.boolean :other_accident_present
      t.datetime :current_illness_date
      t.string :qual_1
      t.datetime :other_date
      t.string :qual_2
      t.datetime :unable_to_work_start_date
      t.datetime :unable_to_work_end_date
      t.string :ref_prov_name
      t.string :ref_prov_a_field
      t.string :ref_prov_npi
      t.datetime :hospitalization_start_date
      t.datetime :hospitalization_end_date
      t.string :additional_claim
      t.boolean :outside_lab
      t.string :charges
      t.string :resubmission_code
      t.string :original_ref_number
      t.string :prior_auth_number
      t.string :fed_tax_id_type
      t.string :fed_tax_id_no
      t.boolean :accept_assignment
      t.string :total_charge
      t.string :amount_paid
      t.string :serv_fac_name
      t.string :serv_fac_address
      t.string :serv_fac_phone
      t.string :serv_fac_npi
      t.string :serv_fac_field_b
      t.string :prov_name
      t.string :prov_address
      t.string :prov_phone
      t.string :prov_npi
      t.string :prov_field_b
    end
  end
end
