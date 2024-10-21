class AddEndTimingToProgramActions < ActiveRecord::Migration[6.0]
  def change
    add_column :program_actions, :end_timing, :string
  end
end
