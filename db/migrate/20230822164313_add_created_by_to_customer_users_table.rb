class AddCreatedByToCustomerUsersTable < ActiveRecord::Migration[6.0]
  def change
    add_reference :customer_users, :created_by, foreign_key: { to_table: :users }
  end
end
