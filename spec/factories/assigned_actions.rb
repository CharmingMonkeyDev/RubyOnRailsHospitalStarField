# frozen_string_literal: true

FactoryBot.define do
  factory :assigned_action do
    patient_action { nil }
    text { 'MyText' }
    subtext { 'MyText' }
    recurring { false }
    user { nil }
  end
end
