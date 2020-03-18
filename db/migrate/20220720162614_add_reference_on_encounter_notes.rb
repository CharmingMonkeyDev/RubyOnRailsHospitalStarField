class AddReferenceOnEncounterNotes < ActiveRecord::Migration[6.0]
  def change
    add_reference :encounter_notes, :encounter_billing, null: false, foreign_key: true
  end
end
