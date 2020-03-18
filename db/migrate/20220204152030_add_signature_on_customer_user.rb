class AddSignatureOnCustomerUser < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_users, :signature, :string
  end
end
