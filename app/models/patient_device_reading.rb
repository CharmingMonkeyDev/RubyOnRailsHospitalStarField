# frozen_string_literal: true

class PatientDeviceReading < ApplicationRecord
  belongs_to :patient_device
  belongs_to :creator, class_name: "User", foreign_key: "created_by_id", optional: true
  default_scope { where('date_recorded > ?', 4.weeks.ago).order('date_recorded DESC').limit(50) }


  def serializable_hash(options = nil)
    super(options).merge(
      user: patient_device&.user,
      creator: creator
    )
  end
end
