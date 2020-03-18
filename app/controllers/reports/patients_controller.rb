# frozen_string_literal: true
class Reports::PatientsController < ApplicationController
    # before_action :authenticate_user!

    def patient_information
        patient = User.find(params[:patient_id])
        log_info("User ID #{current_user&.id} accessed patient information for #{patient&.id} --Reports::PatientsController::patient_information")
        result = {
            name: patient.name,
            gender: patient.gender,
            age: patient.age,
            date_of_birth: patient.date_of_birth&.strftime("%m/%d/%Y"),
            full_address: patient.full_address,
            user_creation_type: patient.user_creation_type
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::PatientsController#patient_information")
        render json: Result.new(nil, e&.message, false), status: 500
    end

    def patient_information_assets
        log_info("User ID #{current_user&.id} accessed assets  --Reports::PatientsController::patient_information_assets")
        result = {
            chat_icon_with_orange_line: ActionController::Base.helpers.asset_url('chat_icon_with_orange_line.png'),
            the_wall_icon_grey: ActionController::Base.helpers.asset_url('the_wall_icon_grey.png'),
            pencil_grey: ActionController::Base.helpers.asset_url('pencil_grey.png'),
        }
        render json: Result.new(result, "Assets fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::PatientsController#patient_information_assets")
        render json: Result.new(nil, e&.message, false), status: 500
    end
end
