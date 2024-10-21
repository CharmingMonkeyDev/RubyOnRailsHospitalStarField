class CreateEncounterNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter_notes do |t|
      t.timestamps
      t.string :notes, default: ""
      t.references :creator, null: false, foreign_key: {to_table: 'users'}
    end
  end
end
