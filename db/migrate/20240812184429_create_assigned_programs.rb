class CreateAssignedPrograms < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_programs do |t|
      t.references :patient, foreign_key: { to_table: :users }, index: true, null: false
      t.references :program, foreign_key: { to_table: :programs }, index: true, null: false
      t.string :status, null: false, default: "active"
      t.datetime :start_date, null: false
      t.references :assigned_by, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
