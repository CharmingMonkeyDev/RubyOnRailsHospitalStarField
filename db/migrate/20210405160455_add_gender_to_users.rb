# frozen_string_literal: true

class AddGenderToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :gender, :string
  end
end
