class AddLockedAtToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :locked_at, :datetime
  end
end
