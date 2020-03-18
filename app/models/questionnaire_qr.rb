class QuestionnaireQr < ApplicationRecord
  belongs_to :customer
  belongs_to :patient, class_name: "User", foreign_key: 'patient_id'
  belongs_to :assigned_by, class_name: "User", foreign_key: 'assigned_by_id'
end
