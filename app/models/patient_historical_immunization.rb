class PatientHistoricalImmunization < ApplicationRecord
  belongs_to :user
  # callbacks
  before_create :validate_uniq_historic

  private

  def validate_uniq_historic
    if PatientHistoricalImmunization.exists?(user_id: self.user_id, vaccine_name: self.vaccine_name, immunization_date: self.immunization_date)
      errors.add(:base, 'Forecast already exists.')
      throw :abort
    end
  end
end
