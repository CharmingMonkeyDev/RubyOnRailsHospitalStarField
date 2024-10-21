class QuestionnaireCategoriesController < ApplicationController

    def index
        selected_customer = current_user.customer_selection.customer
        customer_categories = selected_customer.questionnaire_categories
        render json: Result.new(customer_categories, "Questionnaire Category fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --QuestionnaireCategoriesController::index")
        render json: Result.new(nil, "Questionnaire Category cannot be fetched", false), status: 500
    end

    def create
        qc = QuestionnaireCategory.create(permit_params)
        selected_customer = current_user.customer_selection.customer
        qc.update(customer_id: selected_customer.id)
        render json: Result.new(qc, "Questionnaire Category created", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --QuestionnaireCategoriesController::create")
        render json: Result.new(nil, "Questionnaire Category cannot be created", false), status: 500
    end

    def show
        qc = QuestionnaireCategory.find(params[:id])
        render json: Result.new(qc, "Questionnaire Category fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --QuestionnaireCategoriesController::show")
        render json: Result.new(nil, "Questionnaire Category cannot be fetched", false), status: 500
    end

    def update
        qc = QuestionnaireCategory.find(params[:id])
        qc.update(permit_params)
        render json: Result.new(qc, "Questionnaire Category updated", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --QuestionnaireCategoriesController::update")
        render json: Result.new(nil, "Questionnaire Category cannot be updated", false), status: 500
    end

    def destroy
        qc = QuestionnaireCategory.find(params[:id])
        qc.destroy
        render json: Result.new(qc, "Questionnaire Category deleted", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --QuestionnaireCategoriesController::destroy")
        render json: Result.new(nil, "Questionnaire Category cannot be deleted", false), status: 500
    end

    def archive
        qc = QuestionnaireCategory.find(params[:id])
        if qc.questionnaires.where(status: "draft").count > 0
            return render json: Result.new(nil, "Cannot Archive Category being used by existing Draft Questionnaires.", false), status: 401
        end
        qc.update(is_archived: true)
        render json: Result.new(qc, "Questionnaire Category archived", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --QuestionnaireCategoriesController::archive")
        render json: Result.new(nil, "Questionnaire Category cannot be archived", false), status: 500
    end

    private 

    def permit_params
        params.require(:questionnaire_category).permit(
            :display_name,
            :icon,
            :is_default
        )
    end
end
