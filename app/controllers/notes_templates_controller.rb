class NotesTemplatesController < ApplicationController

    def index
        templates = NotesTemplate.where(archived: false).order(:name)
        log_info("User#{current_user&.id} accesses templates --NotesTemplatesController::index")
        render json: Result.new(templates, "Templates Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --NotesTemplatesController::index")
        render json: Result.new(nil, e, false), status: 500
    end

    def create
        result = ProcessNotesTemplateCreation.new(new_permit_params.merge(user_id: current_user.id)).call
        log_info("User#{current_user&.id} created template --NotesTemplatesController::create")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --NotesTemplatesController::create")
        render json: Result.new(nil, e, false), status: 500
    end

    def edit
        template = NotesTemplate.find(params[:id])
        log_info("User#{current_user&.id} edited template #{template.id} --NotesTemplatesController::edit")
        render json: Result.new(template, "Template Fetched", true), status: 200
    rescue ActiveRecord::RecordNotFound
        render json: Result.new(nil, "Not found", false), status: 404
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --NotesTemplatesController::edit")
        render json: Result.new(nil, e, false), status: 500
    end

    def update
        template = NotesTemplate.find(params[:id])
        result = ProcessNotesTemplateUpdate.new(edit_permit_params.merge(template_id: template.id)).call
        log_info("User#{current_user&.id} updated template #{template.id} --NotesTemplatesController::edit")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --NotesTemplatesController::update")
        render json: Result.new(nil, e, false), status: 500
    end

    def destroy
        notes_template = NotesTemplate.find(params[:id])
        notes_template.update!(archived: true)
        log_info("User#{current_user&.id} archived template #{notes_template.id} --NotesTemplatesController::edit")
        render json: Result.new(nil, "Template archived", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --NotesTemplatesController::destroy")
        render json: Result.new(nil, e, false), status: 500
    end

    private

    def new_permit_params
        params.require(:notes_template).permit(:name, notes_template_blocks: [:id, :order, :note])
    end

    def edit_permit_params
        params.require(:notes_template).permit(
            :name, 
            removed_block_ids: [], 
            notes_template_blocks: [
                :id, 
                :order, 
                :note,
                :notes_template_id,
                :created_at,
                :updated_at
            ]
        )
    end
end
