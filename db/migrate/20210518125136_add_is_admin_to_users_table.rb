# frozen_string_literal: true

class AddIsAdminToUsersTable < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :is_admin, :boolean, default: false
  end
end
