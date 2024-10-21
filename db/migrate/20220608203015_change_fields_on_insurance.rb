class ChangeFieldsOnInsurance < ActiveRecord::Migration[6.0]
  def change
    remove_column :patient_insurances, :account_number
    remove_column :patient_insurances, :payor
    add_column :patient_insurances, :insurance_type, :string
    add_column :patient_insurances, :phone_number, :string
  end
end
