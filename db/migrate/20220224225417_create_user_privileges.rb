class CreateUserPrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :user_privileges do |t|
      t.references :user, null: false, foreign_key: true
      t.references :privilege, null: false, foreign_key: true
      t.boolean :privilege_state, default: false
      t.timestamps
    end
  end
end
