class ActionStepQuickLaunch < ApplicationRecord
  belongs_to :questionnaire, optional: true
  belongs_to :action_step, optional: true

  enum launch_type: {
    questionnaire: "questionnaire",
    encounter: "encounter",
  }

  def serializable_hash(options = nil)
    super(options).merge(
      questionnaire: self.questionnaire,
    )
  end
end
