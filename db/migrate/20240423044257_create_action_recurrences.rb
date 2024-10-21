class CreateActionRecurrences < ActiveRecord::Migration[6.0]
  def change
    create_table :action_recurrences do |t|
      t.boolean :start_on_program_start
      t.boolean :start_after_program_start
      t.integer :start_after_program_start_value
      t.string  :start_after_program_start_unit
      t.boolean :repeat
      t.integer :repeat_value
      t.string  :repeat_unit
      t.boolean :monday
      t.boolean :tuesday
      t.boolean :wednesday
      t.boolean :thursday
      t.boolean :friday
      t.boolean :saturday
      t.boolean :sunday
      t.boolean :no_end_date
      t.boolean :end_after_occurences
      t.integer :occurences
      t.boolean :end_after_program_start
      t.integer :end_date_value
      t.integer :end_after_program_start_value
      t.string  :end_after_program_start_unit
      t.references :action

      t.timestamps
    end
  end
end