class AddLastContactToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :last_contact, :date
  end
end
