FactoryBot.define do
  factory :customer_selection do
    user { nil }
    customer { nil }
    do_not_ask { false }
  end
end
