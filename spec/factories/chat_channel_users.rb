# frozen_string_literal: true

FactoryBot.define do
  factory :chat_channel_user do
    user
    channel
    chat_user { 'MyString' }
  end
end
