# frozen_string_literal: true

class AddPharmacyGroupToActions < ActiveRecord::Migration[6.0]
  def change
    add_reference :patient_actions, :pharmacy_group, null: false, foreign_key: true
  end
end
