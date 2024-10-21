class CreateAssignmentHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :assignment_histories do |t|
      t.references :loggable, polymorphic: true, null: false
      t.references :patient, foreign_key: { to_table: :users }, index: true, null: false
      t.references :user, foreign_key: { to_table: :users }, index: true, null: true
      t.text :description

      t.timestamps
    end
  end
end
