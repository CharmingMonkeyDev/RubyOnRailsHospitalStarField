# frozen_string_literal: true

class AddPharmacyGroupIdToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :pharmacy_group, null: false, foreign_key: true
  end
end
