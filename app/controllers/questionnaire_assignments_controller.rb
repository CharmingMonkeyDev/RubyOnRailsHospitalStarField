class QuestionnaireAssignmentsController < ApplicationController
    skip_before_action :authenticate_user!, only: [:submission]
    def index
        patient = current_user.get_patients.find(params[:patient_id])
        assigned_qs = patient.questionnaire_assignments.order(created_at: :desc)
        render json: Result.new(assigned_qs, "Questionnaire fetched successfully", true), status: 200
    rescue ActiveRecord::RecordNotFound
        render json: Result.new(nil, "Not found", false), status: :not_found
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be fetched", false), status: 500
    end
    
    def assets
        customer = current_user.customer_selection.customer
        questionnaires = customer.questionnaires.select("id", "name", "category", "questionnaire_category_id").where(status: "published")
        categories = questionnaires.pluck(:category).uniq.compact.sort
        render json: Result.new(
            {questionnaires: questionnaires, categories: categories},
             "Questionnaires fetched",
              true
            ), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaires cannot be fetched", false), status: 500
    end

    def create
        provider = current_user
        updated_permit_params = permit_params.merge({provider_id: provider.id})
        result = ProcessQuestionnaireAssignment.new(updated_permit_params).call
        render json: result, status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaires cannot be fetched", false), status: 500
    end

    def submission
        @questionnaire_assignment = QuestionnaireAssignment.find_by_uuid(params[:uuid])
        unless @questionnaire_assignment
            flash[:error] = "Cannot find the assignment"
            redirect_to new_user_session_path
            return
        end

        if @questionnaire_assignment.submission_status == "submitted"
            flash[:error] = "Questionnaire is already submited"
            redirect_to new_user_session_path
            return
        end

        if @questionnaire_assignment.expiration_date < Date.today
            flash[:error] = "Questionnaire is alreay expired"
            redirect_to new_user_session_path
            return
        end

        if @questionnaire_assignment.assignment_type == "manual"
            redirect_to questionnaire_assignments_submission_prov_path(uuid: @questionnaire_assignment.uuid)
            return
        end

    rescue StandardError => e
        flash[:error] = "Something went wrong #{e}"
        redirect_to new_user_session_path
    end

    def submission_prov
        @redirect = params[:redirect]
        @questionnaire_assignment = QuestionnaireAssignment.find_by_uuid(params[:uuid])
        render template: 'questionnaire_assignments/submission'
    end

    private

    def permit_params
        params.require(:questionnaire_assignment).permit(
            :user_id, 
            :questionnaire_id, 
            :assignment_type, 
            :expiration_date
        )
    end

end
 