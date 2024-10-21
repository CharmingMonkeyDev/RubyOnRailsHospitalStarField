FactoryBot.define do
  factory :questionnaire_category do
    customer { nil }
    display_name { "MyString" }
    db_name { "MyString" }
    is_default { false }
  end
end
