class EncounterInsuranceInformation < ApplicationRecord
  # this table stores, snapshot of patient information for each encounter
  # since insurance information can changes a lot thoughout a patient life but we have to keep the same info for encounter, havign separate table is better alternative to store the value

  belongs_to :encounter_billing

  enum relationship: {
    "self": "self",
    "spouse": "spouse",
    "child": "child",
    "other": "other"
  }

  enum sex: {
    "male": "male",
    "female": "female"
  }
end
