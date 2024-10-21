# frozen_string_literal: true

class PatientLab < ApplicationRecord
  belongs_to :user
  default_scope { order('created_at DESC') }
end
