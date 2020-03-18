class RemoveStatusFromCustomers < ActiveRecord::Migration[6.0]
  def change
    remove_column :customers, :status
  end
end
