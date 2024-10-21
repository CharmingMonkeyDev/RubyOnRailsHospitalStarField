class CreatePatientNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_notes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :note

      t.timestamps
    end
  end
end
