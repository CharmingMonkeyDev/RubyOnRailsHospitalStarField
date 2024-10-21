class AddActiveOnChatChannels < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_channels, :active, :boolean, default: true
  end
end
