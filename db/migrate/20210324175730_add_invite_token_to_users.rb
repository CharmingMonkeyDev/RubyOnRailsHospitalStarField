# frozen_string_literal: true

class AddInviteTokenToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :invite_token, :string
  end
end
