# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    email { "dev+#{rand(1..10_000)}@codelation.com" }
    password { 'secret' }
    first_name { 'First' }
    last_name { 'Last' }
    role {"patient"}
  end
end
