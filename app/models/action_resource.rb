# frozen_string_literal: true

class ActionResource < ApplicationRecord
  belongs_to :patient_action
  belongs_to :resource_item

  def serializable_hash(options = nil)
    super(options).merge(resource_item: resource_item)
  end
end
