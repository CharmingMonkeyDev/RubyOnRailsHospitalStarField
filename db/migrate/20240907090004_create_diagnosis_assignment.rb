class CreateDiagnosisAssignment < ActiveRecord::Migration[6.0]
  def change
    create_table :diagnosis_assignments do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :diagnosis_code_value
      t.string :diagnosis_code_desc
      t.string :action_type
      t.integer :actor_id
      t.boolean :active, null: false

      t.timestamps
    end
  end
end