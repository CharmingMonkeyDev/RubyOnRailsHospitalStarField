# frozen_string_literal: true
class DataFetching::AdtNotificationsController < ApplicationController
    skip_before_action :authenticate_user!  #TODO should this be authenticated?

    def index
        user = User.find(params[:user_id])
        adt_patient_notifications = user.adt_patient_notifications
        log_info("User ID #{current_user&.id} accessed ADT Notification for user ID #{user&.id}-- DataFetching::AdtNotificationsController::index")
        render json: Result.new(adt_patient_notifications, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::AdtNotificationsController::index")
        render json: Result.new(nil, "Data cannot be fetched", false), status: 500
    end
end
