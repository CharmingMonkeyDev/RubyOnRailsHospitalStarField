class AddNotesToAssignmentHistoriesTable < ActiveRecord::Migration[6.0]
  def change
    add_column :assignment_histories, :notes, :text
  end
end