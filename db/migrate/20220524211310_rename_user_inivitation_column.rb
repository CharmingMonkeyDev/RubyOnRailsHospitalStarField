class RenameUserInivitationColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :user_invitation_type, :user_creation_type
  end
end
