# frozen_string_literal: true

class AddStartDateToAssignedPathways < ActiveRecord::Migration[6.0]
  def change
    add_column :assigned_pathways, :start_date, :datetime
  end
end
