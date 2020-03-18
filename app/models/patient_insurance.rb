class PatientInsurance < ApplicationRecord
  # IMPORTANT: This model is used for patient current insurance informtion storage
  # While generating claim, the insurance information is stored as snapshot from the claim and does not affect the change made on current informaiton
  # for encounter information we have encounter_insurance_informations table
  
  belongs_to :user
  belongs_to :insured_user, class_name: 'User', foreign_key: 'insured_user_id', optional: true
  belongs_to :secondary_patient_insurance, class_name: 'User', foreign_key: 'secondary_patient_insurance_id', optional: true

  enum relationship: {
    "self": "self",
    "spouse": "spouse",
    "child": "child",
    "other": "other"
  }

  def serializable_hash(options = nil)
    super(options).merge(
      formatted_insured_dob: formatted_insured_dob, 
    )
  end

  def formatted_insured_dob
    self.insured_dob&.strftime("%m/%d/%Y")
  end
end
