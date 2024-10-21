# frozen_string_literal: true

class CreateActionPathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    create_table :action_pathway_week_actions do |t|
      t.references :patient_action, null: false, foreign_key: true
      t.references :action_pathway_week, null: false, foreign_key: true

      t.timestamps
    end
  end
end
