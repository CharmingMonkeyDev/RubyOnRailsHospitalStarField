# frozen_string_literal: true

FactoryBot.define do
  factory :patient_medication do
    user
    name { 'MyString' }
    value { 'MyString' }
  end
end
