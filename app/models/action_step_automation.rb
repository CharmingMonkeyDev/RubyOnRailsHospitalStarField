class ActionStepAutomation < ApplicationRecord
  belongs_to :questionnaire, optional: true
  belongs_to :action_step, optional: true

  enum activity_type: {
    sending: "sending",
  }

  enum automation_type: {
    questionnaire: "questionnaire",
  }

  def serializable_hash(options = nil)
    super(options).merge(
      questionnaire: self.questionnaire,
    )
  end
end
