# frozen_string_literal: true

class CreateAssignedPathways < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_pathways do |t|
      t.references :action_pathway, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
