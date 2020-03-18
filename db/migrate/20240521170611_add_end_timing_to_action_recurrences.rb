class AddEndTimingToActionRecurrences < ActiveRecord::Migration[6.0]
  def change
    add_column :action_recurrences, :end_timing, :string
  end
end
