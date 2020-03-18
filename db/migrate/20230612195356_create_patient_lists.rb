class CreatePatientLists < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_lists do |t|
      t.references :owner, null: false, foreign_key: {to_table: :users}
      t.string :name

      t.timestamps
    end
  end
end