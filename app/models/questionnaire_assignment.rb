class QuestionnaireAssignment < ApplicationRecord
    belongs_to :user
    belongs_to :provider, foreign_key: "provider_id", class_name: "User"
    belongs_to :questionnaire
    has_one :customer, through: :questionnaire
    has_one :questionnaire_submission, dependent: :destroy

    enum assignment_type: {
        "sending": "sending", # cannot have send as enum value SMH ruby
        "manual": "manual"
    }

    enum submission_status: {
        "pending": "pending",
        "submitted": "submitted"
    }

    def serializable_hash(options = nil)
        super(options).merge(
        category: self.questionnaire.category,
        name: self.questionnaire.name,
        )
    end

end
