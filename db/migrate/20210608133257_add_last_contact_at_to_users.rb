# frozen_string_literal: true

class AddLastContactAtToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :last_contact_at, :datetime
  end
end
