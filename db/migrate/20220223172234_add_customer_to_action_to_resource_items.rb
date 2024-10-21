class AddCustomerToActionToResourceItems < ActiveRecord::Migration[6.0]
  def change
    add_reference :resource_items, :customer, index: true
    change_column_null :resource_items, :pharmacy_group_id, true
  end
end
