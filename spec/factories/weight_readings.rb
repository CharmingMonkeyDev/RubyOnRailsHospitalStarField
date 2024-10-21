# frozen_string_literal: true

FactoryBot.define do
  factory :weight_reading do
    date_recorded { '2021-07-07 11:41:52' }
    reading_value { 'MyString' }
    user { nil }
  end
end
