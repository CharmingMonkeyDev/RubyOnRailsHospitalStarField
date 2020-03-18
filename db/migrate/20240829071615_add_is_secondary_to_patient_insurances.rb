class AddIsSecondaryToPatientInsurances < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_insurances, :is_secondary, :boolean, default: false
  end
end
