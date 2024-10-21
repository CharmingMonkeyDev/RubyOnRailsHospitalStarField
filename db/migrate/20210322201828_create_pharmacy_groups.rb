# frozen_string_literal: true

class CreatePharmacyGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :pharmacy_groups do |t|
      t.string :name

      t.timestamps
    end
  end
end
