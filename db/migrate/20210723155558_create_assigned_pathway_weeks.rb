# frozen_string_literal: true

class CreateAssignedPathwayWeeks < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_pathway_weeks do |t|
      t.references :assigned_pathway, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
