# frozen_string_literal: true

class AddStartDateToAssignePathwayWeekActions < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_pathway_weeks, :start_date, :datetime
  end
end
