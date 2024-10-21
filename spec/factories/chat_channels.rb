# frozen_string_literal: true

FactoryBot.define do
  factory :chat_channel do
    name { 'MyString' }
    user
  end
end
