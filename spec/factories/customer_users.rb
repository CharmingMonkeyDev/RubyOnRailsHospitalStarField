FactoryBot.define do
  factory :customer_user do
    user { nil }
    customer { nil }
    assigned_at { "2022-01-27 13:13:49" }
    accepted_at { "2022-01-27 13:13:49" }
    cancelled_at { "2022-01-27 13:13:49" }
    status { "MyString" }
  end
end
