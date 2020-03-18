class ChangeNameFieldToFirstName < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :name, :first_name
  end
end
