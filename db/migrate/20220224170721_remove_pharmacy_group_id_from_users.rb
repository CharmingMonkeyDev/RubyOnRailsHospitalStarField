class RemovePharmacyGroupIdFromUsers < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :pharmacy_group_id
  end
end
