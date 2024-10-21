class ActionCategoriesController < ApplicationController

    def index
        selected_customer = current_user.customer_selection.customer
        customer_categories = selected_customer.action_categories
        render json: Result.new(customer_categories, "Action Category fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ActionCategoriesController::index")
        render json: Result.new(nil, "Action Category cannot be fetched", false), status: 500
    end

    def create
        selected_customer = current_user.customer_selection.customer
        category = ActionCategory.create(permit_params.merge(:customer_id => selected_customer.id))

        render json: Result.new(category, "Action Category created", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ActionCategoriesController::create")
        render json: Result.new(nil, "Action Category cannot be created", false), status: 500
    end

    def update
        selected_customer = current_user.customer_selection.customer
        cat = selected_customer.action_categories.find(params[:id])
        cat.update(permit_params)
        draft_actions = cat.actions.where(status: "draft")
        draft_actions.update_all(category: cat.name)

        render json: Result.new(cat, "Action Category updated", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ActionCategoriesController::update")
        render json: Result.new(nil, "Action Category cannot be updated", false), status: 500
    end

    def archive
        selected_customer = current_user.customer_selection.customer
        cat = selected_customer.action_categories.find(params[:id])
        if cat.actions.where(status: "draft").count > 0
            return render json: Result.new(nil, "Cannot Archive Category being used by existing Draft Action Builder.", false), status: 401
        end
        cat.update(is_archived: true)
        render json: Result.new(cat, "Action Category archived", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ActionCategoriesController::archive")
        render json: Result.new(nil, "Action Category cannot be archived", false), status: 500
    end

    private 

    def permit_params
        params.require(:action_category).permit(
            :name
        )
    end
end
