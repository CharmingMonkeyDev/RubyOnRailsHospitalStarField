# frozen_string_literal: true

FactoryBot.define do
  factory :patient_device_reading do
    patient_device
    reading_type { 'MyString' }
    reading_value { 'Test Value' }
    date_recorded { '2021-04-21 12:22:34' }
  end
end
