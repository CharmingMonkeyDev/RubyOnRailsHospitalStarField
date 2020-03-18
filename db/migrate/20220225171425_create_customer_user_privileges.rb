class CreateCustomerUserPrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_user_privileges do |t|
      t.references :customer_user, null: false, foreign_key: true
      t.references :privilege, null: false, foreign_key: true
      t.boolean :privilege_state, default: false
      t.timestamps
    end
  end
end
