# frozen_string_literal: true

class AddFieldToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :address, :string
    add_column :users, :city, :string
    add_column :users, :state, :string
    add_column :users, :zip, :string
    add_column :users, :mobile_phone_number, :string
  end
end
