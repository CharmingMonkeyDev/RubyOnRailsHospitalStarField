# frozen_string_literal: true

class PatientDevice < ApplicationRecord
  belongs_to :user
  has_many :patient_device_readings

  def as_json(options = {})
    options[:include] =
      %i[patient_device_readings]
    super
  end
end
