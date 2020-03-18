# frozen_string_literal: true

class AddDateOfBirthToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :date_of_birth, :datetime
  end
end
