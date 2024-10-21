class AssignedActionResource < ApplicationRecord
  belongs_to :assigned_action
  belongs_to :resource_item
  default_scope -> {includes(:resource_item)}
end
