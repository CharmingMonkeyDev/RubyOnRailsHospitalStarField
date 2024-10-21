class AddUserInvitationType < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :user_invitation_type, :string
  end
end
