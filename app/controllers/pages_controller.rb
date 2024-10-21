class PagesController < ApplicationController
    before_action :authenticate_user!, :verify_two_factor, :verify_customer_selection, only: [:index]
    include PatientDataHelper

    def index
        log_info("User ID #{current_user&.id} accessed homepage --PagesController::index")
    end

    def customer_consent_new
        unless params[:uuid].present?
            flash[:notice] = "Cannot find the user."
            redirect_to root_path
            return
        end

        @user = User.find_by(uuid: params[:uuid])

        unless params[:uuid].present?
            flash[:notice] = "Cannot find the user."
            redirect_to new_user_session_path
            return
        end 


        @pending_customer_user = @user.customer_users.where(id: params[:customer_user]).first

        unless @pending_customer_user.present?
            flash[:notice] = "Cannot find the customer."
            redirect_to new_user_session_path
            return 
        end
    end

    def customer_consent_update
        @user = User.find_by(uuid: params[:uuid])
        @pending_customer_user = CustomerUser.find(permit_params[:pending_customer_user_id])
        signature = permit_params[:signature]

        if @user.present? && @pending_customer_user.present? && signature.present?
            @pending_customer_user.update!({
                signature: signature,
                status: "accepted",
                accepted_at: Time.now
            })
            log_info("User ID #{@user&.id} updated Customer User record ID #{@pending_customer_user&.id} -- PagesController::customer_consent_update")
            flash[:notice] = "Successfully updated."
            redirect_to new_user_session_path
        else
            redirect_back(fallback_location: root_path)
        end
    end

    def feature_flags
        flags = {
            FEATURE_BULK_UPLOAD_ON: ENV["FEATURE_BULK_UPLOAD_ON"],
            FEATURE_REPORTS_ON: ENV["FEATURE_BULK_UPLOAD_ON"],
            FEATURE_ACTION_BUILDER_ON: ENV["FEATURE_ACTION_BUILDER_ON"],
            FEATURE_PROGRAM_BUILDER_ON: ENV["FEATURE_PROGRAM_BUILDER_ON"],
            FEATURE_ACTION_SETTINGS_ON: ENV["FEATURE_ACTION_SETTINGS_ON"],
        }
        log_info("User ID #{current_user&.id} accessed feature flags --Pages::feature_flags")
        render json: Result.new(flags, "Feature flag fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --pages#feature_flags")
        render json: Result.new(nil, "Feature flag fetched", false), status: 500 
    end
        

    private

    def permit_params
        params.require(:consent).permit(:signature, :pending_customer_user_id, :i_agree)
    end
end
