# frozen_string_literal: true

class CreateAssignedPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_pathway_week_actions do |t|
      t.references :patient_action, null: false, foreign_key: true
      t.references :assigned_pathway_week, null: false, foreign_key: true
      t.text :text
      t.text :subtext
      t.boolean :recurring

      t.timestamps
    end
  end
end
