class CreateCustomerPermissionControls < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_permission_controls do |t|
      t.references :customer, null: false, foreign_key: true
      t.references :customer_permission, null: false, foreign_key: true
      t.boolean :permitted, default: false

      t.timestamps
    end
  end
end
