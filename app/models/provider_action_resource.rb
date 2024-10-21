class ProviderActionResource < ApplicationRecord
  belongs_to :action
  belongs_to :resource_item
end
