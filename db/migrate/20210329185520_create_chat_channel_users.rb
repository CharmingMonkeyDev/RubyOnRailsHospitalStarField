# frozen_string_literal: true

class CreateChatChannelUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_channel_users do |t|
      t.references :user, null: false, foreign_key: true
      t.references :chat_channel, null: false, foreign_key: true
      t.string :chat_user
      t.string :user_type

      t.timestamps
    end
  end
end
