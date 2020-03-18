class AddUniqIdOnChannels < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_channels, :uniq_channel_id, :string
  end
end
