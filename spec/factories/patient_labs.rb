# frozen_string_literal: true

FactoryBot.define do
  factory :patient_lab do
    user
    lab_type { 'a1c' }
    value { 'MyString' }
  end
end
