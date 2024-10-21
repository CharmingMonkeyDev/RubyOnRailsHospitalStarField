class DataFetching::NotesTemplatesController < ApplicationController
  include JsonHelper
  
  def index
      notes_templates = NotesTemplate.where(archived:false).includes(:notes_template_blocks)
      log_info("User ID #{current_user&.id} accessed notes templates list --DataFetching::NotesTemplatesController::index")
      result = {
          notes_templates: notes_templates
      }
      render json: Result.new(result, "Data fetched", true), status: 200
  rescue StandardError => e
    Rails.logger.error {e}  
    Rails.logger.error {e.backtrace.join("\n")}  
    render json: Result.new(nil, "Error on data fetch", false), status: 500
  end
  
  def show 
    notes_template = NotesTemplate.find(params[:id])
    log_info("User ID #{current_user&.id} accessed notes template show --DataFetching::NotesTemplatesController::show")
    result = {
        notes_template: notes_template
    }
    render json: Result.new(result, "Data fetched", true), status: 200
  rescue StandardError => e  
    render json: Result.new(nil, "Error on data fetch", false), status: 500  
  end 
  
end 