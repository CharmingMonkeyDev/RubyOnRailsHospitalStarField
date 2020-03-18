# frozen_string_literal: true

class ChatChannelUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat_channel

  def as_json(options = {})
    options[:include] = %i[user]
    super
  end
end
