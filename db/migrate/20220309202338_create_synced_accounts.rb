class CreateSyncedAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :synced_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :account_type, null: false
      t.timestamps
    end
  end
end
