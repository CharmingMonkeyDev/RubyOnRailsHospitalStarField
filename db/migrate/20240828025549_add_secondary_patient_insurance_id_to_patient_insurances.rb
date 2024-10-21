class AddSecondaryPatientInsuranceIdToPatientInsurances < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_insurances, :secondary_patient_insurance_id, :bigint
    add_index :patient_insurances, :secondary_patient_insurance_id
  end
end
