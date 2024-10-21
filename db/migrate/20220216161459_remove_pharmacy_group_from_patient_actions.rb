class RemovePharmacyGroupFromPatientActions < ActiveRecord::Migration[6.0]
  def change
    remove_reference :patient_actions, :pharmacy_group
  end
end
