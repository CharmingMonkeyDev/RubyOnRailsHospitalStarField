class AddCustomerIdToActionCategories < ActiveRecord::Migration[6.0]
  def change
    add_reference :action_categories, :customer, foreign_key: true, null: true
    add_column :action_categories, :is_archived, :boolean, default: false
  end
end
