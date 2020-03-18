class CreateAssignedProviderActions < ActiveRecord::Migration[6.0]
  def change
    create_table :assigned_provider_actions do |t|
      t.references :patient, foreign_key: { to_table: :users }, index: true, null: false
      t.references :action, foreign_key: { to_table: :actions }, index: true, null: false
      t.datetime :start_date, null: false
      t.string :status
      t.references :patient_program
      t.references :assigned_by, foreign_key: { to_table: :users }, index: true
      t.references :assigned_provider, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
