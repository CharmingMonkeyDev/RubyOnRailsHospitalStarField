class ChangeDateOfBirthColumnToDate < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :date_of_birth, :date
  end
end
