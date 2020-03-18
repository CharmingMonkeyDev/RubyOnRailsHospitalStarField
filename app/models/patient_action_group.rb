# frozen_string_literal: true

class PatientActionGroup < ApplicationRecord
  belongs_to :customer
  has_many :patient_action_group_actions, dependent: :destroy

  def as_json(options = {})
    options[:include] = %i[patient_action_group_actions]
    super
  end
end
