# frozen_string_literal: true

FactoryBot.define do
  factory :assigned_pathway do
    action_pathway { nil }
    user { nil }
    name { 'MyString' }
  end
end
