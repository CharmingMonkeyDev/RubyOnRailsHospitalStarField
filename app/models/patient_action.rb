# frozen_string_literal: true

class PatientAction < ApplicationRecord
  belongs_to :action_category, optional: true
  belongs_to :customer
  has_many :action_resources, dependent: :destroy
  validates_presence_of :text
  HUMANIZED_ATTRIBUTES = {
    :text => "Name"
  }

  def self.human_attribute_name(attr, options = {})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def serializable_hash(options = nil)
    super(options).merge(action_resources: action_resources)
  end
end
