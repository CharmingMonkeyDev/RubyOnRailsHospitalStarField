class CreateLtcFacilityAssignments < ActiveRecord::Migration[6.0]
  def change
    create_table :ltc_facility_assignments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :ltc_facility, null: false, foreign_key: true
      t.string :action_type
      t.integer :actor_id
      t.boolean :active, null: false

      t.timestamps
    end

    add_index :ltc_facility_assignments, [:user_id, :ltc_facility_id]
  end
end