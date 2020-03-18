class AddInsuredToPatientInsurances < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_insurances, :insured_user_id, :integer
  end
end
