class AddLastFirstMiddleNameToPatientInsurances < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_insurances, :last_name, :string
    add_column :patient_insurances, :first_name, :string
    add_column :patient_insurances, :middle_name, :string
    add_column :patient_insurances, :country, :string
  end
end
