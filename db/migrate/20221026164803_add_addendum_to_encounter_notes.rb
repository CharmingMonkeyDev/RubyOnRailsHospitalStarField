class AddAddendumToEncounterNotes < ActiveRecord::Migration[6.0]
  def change
    add_column :encounter_notes, :addendum, :bool, default: false
  end
end
