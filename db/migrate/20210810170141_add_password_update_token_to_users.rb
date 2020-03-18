# frozen_string_literal: true

class AddPasswordUpdateTokenToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :password_update_token, :string
    add_column :users, :email_update_token, :string
  end
end
