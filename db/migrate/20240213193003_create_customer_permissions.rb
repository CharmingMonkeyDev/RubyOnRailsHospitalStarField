class CreateCustomerPermissions < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_permissions do |t|
      t.string :name

      t.timestamps
    end
  end
end
