class ActionStepQueue < ApplicationRecord
  belongs_to :action_queue
  belongs_to :action_step

  enum status: {
    "incomplete": "incomplete",
    "complete": "complete",
    "skipped": "skipped"
  }
end
