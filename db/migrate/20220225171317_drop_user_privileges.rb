class DropUserPrivileges < ActiveRecord::Migration[6.0]
  def change
    drop_table :user_privileges
  end
end
