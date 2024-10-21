class ChangePharmacyGroupIdToCustomerIdOnPatientActionPathways < ActiveRecord::Migration[6.0]
  def change
    remove_column :action_pathways, :pharmacy_group_id
    add_column :action_pathways, :customer_id, :bigint
  end
end
