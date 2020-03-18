class AddChatNotifyToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :chat_notify, :boolean, default: true
    add_column :users, :opt_out_key, :uuid, default: "gen_random_uuid()", null: false
  end
end
