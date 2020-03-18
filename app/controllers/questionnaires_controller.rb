class QuestionnairesController < ApplicationController

    def assets
        default_cats = QuestionnaireCategory.where(is_default: true)
        customer = current_user.customer_selection.customer 
        customer_cats = customer.questionnaire_categories
        all_cats = default_cats.or(customer_cats)
        render json: Result.new({categories: all_cats}, "Questionnaire assets fetched", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire assets cannot be fetched", false), status: 500
    end

    def show
        customer = current_user.customer_selection.customer
        questionnaire = customer.questionnaires.find(params[:id])
        if questionnaire
            render json: Result.new(questionnaire, "Questionnaire fetched", true), include: [:questionnaire_category], status: 200
        else
            render json: Result.new(nil, "You do not have access", false), status: 404
        end
    rescue ActiveRecord::RecordNotFound
        render json: Result.new(nil, "Not found", false), status: 404
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be fetched", false), status: 500
    end

    def index
        user = current_user
        customer = current_user.customer_selection.customer 
        questionnaires = customer.questionnaires.order("created_at DESC")
        if params[:status]
            questionnaires = questionnaires.where(status: params[:status])
        end
        questionnaires = questionnaires.order("created_at DESC")
        render json: Result.new(questionnaires, "Questionnaires fetched", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaires cannot be fetched", false), status: 500
    end

    def create
        user = current_user
        selected_customer = current_user.customer_selection.customer
        complete_params = permit_params.merge(
            user_id: user.id,
            customer_id: selected_customer.id
        )
        questionnaire = Questionnaire.create(complete_params)
        resource_ids = params[:resource_ids]
        if resource_ids
            resource_ids.each do |resource_id|
                QuestionnaireResource.create(questionnaire_id: questionnaire.id, resource_item_id: resource_id)
            end
        end
        render json: Result.new(questionnaire, "Questionnaire saved as #{questionnaire.status}", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be saved", false), status: 500
    end

    def update
        questionnaire = Questionnaire.find(params[:id])

        resource_ids = params[:resource_ids]
        existing_qr_ids = questionnaire.questionnaire_resources.ids
        to_keep_qr_ids = []

        questionnaire.update(permit_params)
        ActiveRecord::Base.transaction do
            resource_ids.each do |resource_id|
                qr = QuestionnaireResource.where(questionnaire_id: questionnaire.id, resource_item_id: resource_id).first
                if !qr 
                    qr = QuestionnaireResource.create(questionnaire_id: questionnaire.id, resource_item_id: resource_id)
                end
                to_keep_qr_ids << qr.id
            end
            to_remove_qr_ids = existing_qr_ids - to_keep_qr_ids
            QuestionnaireResource.where(id: to_remove_qr_ids).destroy_all
        end
        render json: Result.new(questionnaire, "Questionnaire saved as #{questionnaire.status}", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be saved", false), status: 500
    end

    def destroy
        questionnaire = Questionnaire.find(params[:id])
        if questionnaire.status == "draft"
            if questionnaire.questionnaire_assignments.count > 0
                return render json: Result.new(nil, "Questionnaire has associated assignments and thus cannot be deleted.", false), status: 401
            end
            questionnaire.questionnaire_resources.destroy_all
            questionnaire.destroy
            message = "Questionnaire deleted"
        else
            questionnaire.update(status: "archived")
            message = "Questionnaire archived"
        end
        render json: Result.new(nil, message, true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be archived/deleted", false), status: 500
    end

    def publish
        questionnaire = Questionnaire.find(params[:id])
        questionnaire.update(published_at: Time.now, status: "published" )
        render json: Result.new(questionnaire, "Questionnaire published", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be published", false), status: 500
    end

    def toggle_display_tablet
        questionnaire = Questionnaire.find(params[:id])
        questionnaire.update(display_on_tablet: !questionnaire.display_on_tablet)
        render json: Result.new(questionnaire, "Questionnaire published", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Questionnaire cannot be published", false), status: 500
    end

    private

    def permit_params
        params.require(:questionnaire).permit(
        :name,
        :description,
        :category,
        :questionnaire_category_id,
        :status,
        :display_on_tablet,
        questions_attributes: [:id, :title, :question_type, :position, :_destroy, options_attributes: [:id, :title, :_destroy]]
    )
    end
end
