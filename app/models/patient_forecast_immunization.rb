class PatientForecastImmunization < ApplicationRecord
  belongs_to :user

  # callbacks
  before_create :validate_uniq_forecast

  private

  def validate_uniq_forecast
    if PatientForecastImmunization.exists?(user_id: self.user_id, vaccine_type: self.vaccine_type, dose_number: self.dose_number, minimum_valid_date: self.minimum_valid_date)
      errors.add(:base, 'Forecast already exists.')
      throw :abort
    end
  end
end
