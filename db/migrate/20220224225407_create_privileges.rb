class CreatePrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :privileges do |t|
      t.string :name
      t.text :description
      t.boolean :default_pharmacist
      t.boolean :default_physician
      t.boolean :default_coach
      t.boolean :default_patient
      t.timestamps
    end
  end
end
