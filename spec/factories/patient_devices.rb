# frozen_string_literal: true

FactoryBot.define do
  factory :patient_device do
    user
    identifier { 'DEVICEIDENTIFIER' }
  end
end
