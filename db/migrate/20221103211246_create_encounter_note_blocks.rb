class CreateEncounterNoteBlocks < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter_note_blocks do |t|
      t.belongs_to :encounter_note, null: false, foreign_key: true
      t.string :note
      t.integer :order

      t.timestamps
    end
  end
end
