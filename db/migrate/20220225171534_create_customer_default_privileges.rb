class CreateCustomerDefaultPrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_default_privileges do |t|
      t.references :customer, null: false, foreign_key: true
      t.references :privilege, null: false, foreign_key: true
      t.boolean :default_pharmacist, default: false
      t.boolean :default_physician, default: false
      t.boolean :default_coach, default: false
      t.boolean :default_patient, default: false
      t.timestamps
    end
  end
end
