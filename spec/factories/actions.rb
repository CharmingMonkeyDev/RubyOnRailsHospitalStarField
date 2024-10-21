# frozen_string_literal: true

FactoryBot.define do
  factory :patient_action do
    action_category { nil }
    text { 'MyText' }
    subtext { 'MyText' }
    recurring { false }
  end
end
