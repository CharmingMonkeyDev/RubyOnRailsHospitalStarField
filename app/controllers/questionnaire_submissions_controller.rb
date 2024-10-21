class QuestionnaireSubmissionsController < ApplicationController
    skip_before_action :authenticate_user!, only: [:assets, :create, :validate_dob]
    skip_before_action :verify_authenticity_token, only: [:create, :validate_dob]
    
    def assets
        questionnaire = Questionnaire.find(params[:questionnaire_id])
        render json: Result.new(questionnaire, "Questionnaire fetched successfully", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be fetched", false), status: 500
    end

    def create
        questionnaire_assignment = QuestionnaireAssignment.find(permit_params[:questionnaire_assignment_id])
        qs = QuestionnaireSubmission.create(permit_params)
        if params[:signature].present?
            attach_image_from_base64(params[:signature], qs)
        end
        questionnaire_assignment.update(submission_status: "submitted")
        if questionnaire_assignment.user_id == qs.user_id
            ProcessQSubmissionActionQueue.new({questionnaire_submission_id: qs.id, customer_id: questionnaire_assignment.customer.id}).call
        end
        render json: Result.new(qs, "Questionnaire successfully submitted", true), status: 200
    rescue StandardError => e
        log_errors(e)
        render json: Result.new(nil, "Questionnaire cannot be fetched", false), status: 500
    end

    def index
        patient = User.find(params[:patient_id])
        questionnaires = Questionnaire.where(category: params[:category])
        questionnaires = Questionnaire
                            .joins(:questionnaire_assignments)
                            .where(category: params[:category], questionnaire_assignments: { user_id: params[:patient_id] })
                            .includes(:resource_items, questionnaire_assignments: [:provider, questionnaire_submission: :submitter])
                            .includes(questionnaire_assignments: :questionnaire_submission)
                            .distinct
                            .order("name")

        formatted_questionnaires =[]
        questionnaires.each do |questionnaire|
            questionnaire_hash = questionnaire.as_json
            # questionnaire_hash["questions"] = questionnaire.questions
            questionnaire_hash["questionnaire_assignments"] = []
            assignments = questionnaire.questionnaire_assignments.where(user_id: params[:patient_id]).order(created_at: :desc)
            assignments.each do |assignment|
                assignment_hash = assignment.as_json
                assignment_hash["questionnaire_submission"] = assignment.questionnaire_submission
                assignment_hash["provider"] = assignment.provider
                questionnaire_hash["questionnaire_assignments"] << assignment_hash
            end
            formatted_questionnaires << questionnaire_hash
        end

        render json: Result.new({ questionnaires: formatted_questionnaires }, "Questionnaires fetched.", true), status: 200
    end

    def validate_dob
        qa = QuestionnaireAssignment.find(permit_dob_params[:questionnaire_assignment_id])
        birth_date = qa.user.date_of_birth # "Thu, 23 May 2002" format date type
        given_date_str = permit_dob_params[:dob] #Wed, 12 Jan 2022 20:51:00 +0000 data type string
        given_date = Date.parse(given_date_str)
        if birth_date == given_date
            render json: Result.new({user_id: qa.user.id}, "Date Validated", true), status: 200
        else
            render json: Result.new(nil, "Date does not match", false), status: 500
        end
    rescue StandardError => e
        render json: Result.new(nil, "Something went wront #{e}", false), status: 500
    end

    private

    def permit_params
        params.require(:questionnaire_submission).permit(
            :questionnaire_assignment_id,
            :user_id,
            answers_attributes: [:question_id, :accepted, :answer_text, multiple_choice_answers_attributes: [:option_id] ]
        )
    end

    def permit_dob_params
        params.require(:validate_dob).permit(:questionnaire_assignment_id, :dob)
    end

    def attach_image_from_base64(base64_data, qs)
        image_data = base64_data.split(',')[1]
        filename = "#{Time.now.to_i}_signature.png"
        File.open("tmp/#{filename}", 'wb') do |f|
            f.write(Base64.decode64(image_data))
        end
        qs.signature.attach(io: File.open("tmp/#{filename}"), filename: filename)
    end

end
