class AddPatientInsuranceIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :patient_insurance_id, :bigint
    add_column :users, :secondary_patient_insurance_id, :bigint
  end
end
