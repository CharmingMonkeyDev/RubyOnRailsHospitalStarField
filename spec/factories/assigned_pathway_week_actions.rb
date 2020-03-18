# frozen_string_literal: true

FactoryBot.define do
  factory :assigned_pathway_week_action do
    patient_action { nil }
    assigned_pathway_week { nil }
    text { 'MyText' }
    subtext { 'MyText' }
    recurring { false }
  end
end
