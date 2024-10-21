class ProcessQuestionnaireAssignment
    def initialize(attributes)
        @attributes = attributes
        @user_id = @attributes[:user_id]
        @provider_id = @attributes[:provider_id]
        @questionnaire_id = @attributes[:questionnaire_id]
        @assignment_type = @attributes[:assignment_type]
        @expiration_date = @attributes[:expiration_date]
        @provider_id = @attributes[:provider_id]
    end

    def call
        unless patient.mobile_phone_number.present?
            return Result.new(nil, "Patient does not have a phone number. Please add a phone number and try again.", false)
        end

        unless valid_phone_number?
            return Result.new(nil, "Patient does not have a phone number matching XXX-XXX-XXXX format", false)
        end
        qa = process_assignment_creation
        if qa.present?
            reloaded_qa = QuestionnaireAssignment.find(qa.id) #reloading because of missing UUID
            return Result.new(reloaded_qa, "Questionnaire Assigned", true)
        else
            return Result.new(nil, "Questionnaire Cannot Assigned", false)
        end
    end

    private

    attr_accessor :user_id, :provider_id, :questionnaire_id, :assignment_type, :expiration_date, :provider_id

    def patient 
        @patient ||= User.find(user_id)
    end

    def valid_phone_number?
        # Define a regular expression pattern to match the "XXX-XXX-XXXX" format
        phone_number = patient.mobile_phone_number
        pattern = /^\d{3}-\d{3}-\d{4}$/

        if phone_number.match?(pattern)
            return true
        else
            return false
        end
    end

    def process_assignment_creation
        qa = QuestionnaireAssignment.create(
            user_id: user_id,
            provider_id: provider_id,
            questionnaire_id: questionnaire_id,
            assignment_type: assignment_type,
            expiration_date: expiration_date,
            submission_status: "pending"
        )
        if qa.assignment_type == "sending"
            send_questionnaire_link(qa)
        end
        return qa
    rescue StandardError => e
        return nil
    end

    def send_questionnaire_link(qa)
        # reloading qa because creation gives qa without uuid
        reloaded_qa = QuestionnaireAssignment.find(qa.id)
        root_url = Rails.application.routes.url_helpers.root_url
        url = "#{root_url}questionnaire_assignments_submission/#{reloaded_qa.uuid}"
        provider_name = reloaded_qa&.provider&.name
        message = "#{provider_name} is requesting that you respond to a questionnaire regarding your recent communication.
        #{url}
        If you have any questions about the nature of this questionnaire, please visit our website #{root_url}"
        TextSms.new(patient.mobile_phone_number, message).send
    end
end