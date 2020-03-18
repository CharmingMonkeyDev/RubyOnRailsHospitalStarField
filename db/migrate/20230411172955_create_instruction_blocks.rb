class CreateInstructionBlocks < ActiveRecord::Migration[6.0]
  def change
    create_table :instruction_blocks do |t|
      t.timestamps
      t.belongs_to :patient_instruction, null: false, foreign_key: true
      t.string :note
      t.integer :order
    end
  end
end
