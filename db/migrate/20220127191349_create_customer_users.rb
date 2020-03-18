class CreateCustomerUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_users do |t|
      t.timestamps
      t.references :user, null: false, foreign_key: true
      t.references :customer, null: false, foreign_key: true
      t.boolean :is_admin, default: false
      t.datetime :assigned_at
      t.datetime :accepted_at
      t.datetime :cancelled_at
      t.string :status
    end
  end
end
