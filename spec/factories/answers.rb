FactoryBot.define do
  factory :answer do
    questionnaire { nil }
    question { nil }
    answer_text { "MyText" }
    assigned_to { 1 }
    answered_by { 1 }
  end
end
