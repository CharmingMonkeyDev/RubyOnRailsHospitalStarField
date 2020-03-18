class RemoveIsAdminFromUser < ActiveRecord::Migration[6.0]
  def change
    remove_column :customer_users, :is_admin
  end
end
