# frozen_string_literal: true

class AddPatientIdentifierToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :patient_identifier, :string
  end
end
