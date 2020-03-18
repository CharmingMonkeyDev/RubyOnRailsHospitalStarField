class ActionQueueHistory < ApplicationRecord
  belongs_to :action_queue
  belongs_to :user
end
