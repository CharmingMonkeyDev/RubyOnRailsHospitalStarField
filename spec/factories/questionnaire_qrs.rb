FactoryBot.define do
  factory :questionnaire_qr do
    uuid { "" }
    customer { nil }
    patient_id { 1 }
    assign_by_id { 1 }
    invalid { false }
  end
end
