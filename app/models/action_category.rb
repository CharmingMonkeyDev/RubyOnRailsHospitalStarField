# frozen_string_literal: true

class ActionCategory < ApplicationRecord
  has_many :patient_actions
  default_scope { order('sort ASC') }
  has_many :actions
end
