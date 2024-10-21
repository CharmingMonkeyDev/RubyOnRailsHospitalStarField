class AddLockableToDevise < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :failed_attempts, :integer, default: 0
    add_column :users, :unlock_token, :string
  end
end
