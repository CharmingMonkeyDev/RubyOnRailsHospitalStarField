# frozen_string_literal: true

class CreateActionPathways < ActiveRecord::Migration[6.0]
  def change
    create_table :action_pathways do |t|
      t.string :name
      t.references :pharmacy_group

      t.timestamps
    end
  end
end
