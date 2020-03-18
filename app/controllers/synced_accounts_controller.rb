class SyncedAccountsController < ApplicationController
    def index
        synced_accounts = SyncedAccount.where(user: current_user)
        log_info("User ID #{current_user&.id} accessed synced accounts for user #{current_user&.id} --SyncedAccountsController::index")
        render json: Result.new(synced_accounts, "Synced Accounts Fetched", true), status: 200
    rescue
        render json: Result.new(nil, "Synced Accounts could not be fetched", false), status: 200
    end

    def destroy
        synced_account = SyncedAccount.find(params[:id])
        synced_account.destroy!
        log_info("User ID #{current_user&.id} unlinked synced account #{synced_account.id} for user #{current_user&.id} --SyncedAccountsController::destroy")
        flash[:notice] = "Successfully unlinked user account from Dexcom"
        render json: Result.new(nil, "Synced Account Unlinked", true), status: 200
    rescue
        flash[:alert] = "Synced account could not be unlinked"
        render json: Result.new(nil, "Synced Account could not be unlinked", false), status: 200
    end

    def get_oauth_url
        url = "#{(ENV['DEXCOM_OAUTH_URL']).to_s}?client_id=#{(ENV['DEXCOM_CLIENT_ID']).to_s}&redirect_uri=#{(ENV['DEXCOM_REDIRECT_URL']).to_s}&response_type=code&scope=offline_access"
        render json: Result.new(url, "Fetched Dexcom URL", true), status: 200
    end

    def receive_authorization_from_dexcom
        authorization_code = nil
        success = nil
        if params[:code].present?
            authorization_code = params[:code]
            success = SyncedAccountService.new(authorization_code, current_user).call
        end
        if success == true
            flash[:notice] = "Successfully connected user account to Dexcom"
        else
            flash[:alert] = "User account is already connected to Dexcom"
        end
        redirect_to "/sync-device"
    end

    def check_glucose_device_syncing
        user = User.find(params[:user_id])
        synced_accounts = user.synced_accounts
  
        outdated_accounts = user.synced_accounts.includes(:glucose_readings).select do |account|
            account.latest_system_reading_older_than?(6.hours) && account.latest_system_reading_older_than?(30.days) == false
        end

        if outdated_accounts.count == 0
            render json: Result.new(true, "Glucose Device Syncing", true), status: 200
        else
            render json: Result.new(false, "Glucose Device Not Syncing", true), status: 200
        end
    rescue
        render json: Result.new(nil, "Glucose Device Syncing could not be checked", false), status: 200
    end

    private

    def permit_params
        params.require(:synced_account).permit(:user_id)
    end
end
