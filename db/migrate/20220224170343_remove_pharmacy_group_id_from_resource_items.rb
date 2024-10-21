class RemovePharmacyGroupIdFromResourceItems < ActiveRecord::Migration[6.0]
  def change
    remove_column :resource_items, :pharmacy_group_id
  end
end
