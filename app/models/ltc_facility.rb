class LtcFacility < ApplicationRecord
  has_many :ltc_facility_assignments
  has_many :users, through: :ltc_facility_assignments, dependent: :destroy
  has_many :patients, class_name: 'User', foreign_key: 'facility_id'
  belongs_to :customer

  def as_json(options = {})
      super(options).merge({
      'patient_count' => ltc_facility_assignments.where(active: true).count
      })
  end
end