class ProcessQSubmissionActionQueue
    def initialize(attributes)
        @questionnaire_submission_id = attributes[:questionnaire_submission_id]
        @customer_id = attributes[:customer_id]
    end

    def call
        process_submission_queue
    end

    private

    attr_accessor :questionnaire_submission_id, :customer_id

    def questionnaire_submission
        @questionnaire_submission ||= QuestionnaireSubmission.find(questionnaire_submission_id)
    end

    def user
        @user ||= questionnaire_submission.questionnaire_assignment.user
    end

    def process_submission_queue
        if user
            action = Action.where(customer_id: customer_id, action_type: :questionnaire_submission).first
            if action.present?
                action.update(title: "Questionnaire Submission")
            else
                action = Action.create!(
                    action_type: :questionnaire_submission,
                    title: "Questionnaire Submission",
                    customer_id: customer_id,
                    published_at: Time.now,
                    status: :published,
                    action_category_id: ActionCategory.first.id,
                )
            end
            action_queue = ActionQueue.create!(
                patient_id: user.id,
                action_id: action.id,
                due_date: Date.today,
            )
            questionnaire_action = QuestionnaireAction.create!(
                action_queue_id: action_queue.id,
                questionnaire_submission_id: questionnaire_submission.id
            )
        else
            Rollbar.warning("Patient does not exist Questionnaire submission action queue #{adt_patient_notification_id}")
        end
    end
end