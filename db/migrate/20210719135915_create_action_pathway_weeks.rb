# frozen_string_literal: true

class CreateActionPathwayWeeks < ActiveRecord::Migration[6.0]
  def change
    create_table :action_pathway_weeks do |t|
      t.references :action_pathway, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
