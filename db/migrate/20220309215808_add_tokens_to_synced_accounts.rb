class AddTokensToSyncedAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :synced_accounts, :access_token, :string
    add_column :synced_accounts, :refresh_token, :string
  end
end
