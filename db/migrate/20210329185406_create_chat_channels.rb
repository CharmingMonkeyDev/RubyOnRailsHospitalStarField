# frozen_string_literal: true

class CreateChatChannels < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_channels do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
