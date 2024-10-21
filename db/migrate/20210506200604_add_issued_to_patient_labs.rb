# frozen_string_literal: true

class AddIssuedToPatientLabs < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_labs, :issued, :string
  end
end
