FactoryBot.define do
  factory :customer_permission_control do
    customer { nil }
    customer_permission { "" }
    permitted { false }
  end
end
