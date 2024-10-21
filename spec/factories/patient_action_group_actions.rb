# frozen_string_literal: true

FactoryBot.define do
  factory :patient_action_group_action do
    patient_action_group { nil }
    patient_action { nil }
  end
end
