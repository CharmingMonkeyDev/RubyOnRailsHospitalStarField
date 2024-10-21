class AddTwoFactorToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :two_factor_verification_code, :string
    add_column :users, :two_factor_verified_at, :datetime
    add_column :users, :two_factor_code_sent_at, :datetime
    add_column :users, :two_factor_auth_attempts, :integer
  end
end
