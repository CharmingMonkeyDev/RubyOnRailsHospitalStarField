# frozen_string_literal: true

FactoryBot.define do
  factory :blood_pressure_reading do
    date_recorded { '2021-07-07 11:42:14' }
    reading_value { 'MyString' }
    user { nil }
  end
end
