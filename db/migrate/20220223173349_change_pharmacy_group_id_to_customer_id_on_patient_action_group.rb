class ChangePharmacyGroupIdToCustomerIdOnPatientActionGroup < ActiveRecord::Migration[6.0]
  def change
    remove_column :patient_action_groups, :pharmacy_group_id
    add_column :patient_action_groups, :customer_id, :bigint
  end
end
