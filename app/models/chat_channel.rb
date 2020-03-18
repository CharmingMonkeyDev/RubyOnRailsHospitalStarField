# frozen_string_literal: true

class ChatChannel < ApplicationRecord
  belongs_to :user
  has_many :chat_channel_users, dependent: :destroy

  before_create :generate_uniq_channel_id, if: Proc.new { self.uniq_channel_id.nil? }

  def as_json(options = {})
    options[:include] = %i[
      chat_channel_users 
    ]
    super
  end

  protected

  def generate_uniq_channel_id
    self.uniq_channel_id = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless ChatChannel.exists?(uniq_channel_id: random_token)
    end
  end

end
