class CreateNotesTemplates < ActiveRecord::Migration[6.0]
  def change
    create_table :notes_templates do |t|
      t.string :name
      t.boolean :archived, default: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
