class CreateNotesTemplateBlocks < ActiveRecord::Migration[6.0]
  def change
    create_table :notes_template_blocks do |t|
      t.references :notes_template, null: false, foreign_key: true
      t.string :note
      t.integer :order

      t.timestamps
    end
  end
end
