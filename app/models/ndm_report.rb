class NdmReport < ApplicationRecord
  has_one_attached :provider_data
  has_one_attached :patient_eligibility_data
  has_one_attached :drug_claim_data
  has_one_attached :medical_claim_data

  # enum status: {
  #   processing: "processing",
  #   invalid: "invalid",
  #   complete: "complete"
  # }

  def medical_claims_file_url
    file_url(medical_claim_data)
  end

  def drug_claims_file_url
    file_url(drug_claim_data)
  end

  def patient_eligibility_file_url
    file_url(patient_eligibility_data)
  end

  def provider_data_file_url
    file_url(provider_data)
  end

  def file_url(blob)
    Rails.application.routes.url_helpers.url_for(blob)
  end
end
