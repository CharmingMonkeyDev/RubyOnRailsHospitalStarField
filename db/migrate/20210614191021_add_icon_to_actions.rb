# frozen_string_literal: true

class AddIconToActions < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_actions, :icon, :string
  end
end
