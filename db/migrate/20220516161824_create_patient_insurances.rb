class CreatePatientInsurances < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_insurances do |t|
      t.references :user, null: false, foreign_key: true
      t.string :relationship
      t.string :insured_id
      t.string :insured_name
      t.datetime :insured_dob
      t.string :plan_name
      t.string :account_number
      t.string :payor
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.timestamps
    end
  end
end
