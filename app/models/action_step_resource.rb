class ActionStepResource < ApplicationRecord
  belongs_to :action_step
  belongs_to :resource_item

  def serializable_hash(options = nil)
    super(options).merge(resource_item: resource_item)
  end
end
