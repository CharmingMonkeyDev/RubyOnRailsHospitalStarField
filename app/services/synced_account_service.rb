require 'uri'
require 'net/http'
include LogHelper

class SyncedAccountService
    def initialize(authorization_code, user)
        @authorization_code = authorization_code
        @user = user
    end

    def call
        create_synced_account
    end

    private

    def get_dexcom_credentials
        url = URI(ENV["DEXCOM_TOKEN_URL"])
        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        request = Net::HTTP::Post.new(url)
        request["content-type"] = 'application/x-www-form-urlencoded'
        request["cache-control"] = 'no-cache'
        request.body = "client_secret=#{(ENV['DEXCOM_CLIENT_SECRET']).to_s}&client_id=#{(ENV['DEXCOM_CLIENT_ID']).to_s}&code=#{@authorization_code}&grant_type=authorization_code&redirect_uri=#{(ENV['DEXCOM_REDIRECT_URL']).to_s}"
        response = http.request(request)
        return response.read_body
    end

    def create_synced_account
        token_object = get_dexcom_credentials
        access_token = JSON.parse(token_object)["access_token"]
        refresh_token = JSON.parse(token_object)["refresh_token"]
        begin
            SyncedAccount.create!(user: @user, access_token: access_token, refresh_token: refresh_token, account_type: "Dexcom CGM")
            log_info("User ID #{@user&.id} created synced account for user  #{@user&.id} --SyncedAccountService::create_synced_account")
            return true
        rescue StandardError => e
            Rollbar.warning("Error creating synced account with #{e} --SyncedAccountService::create_synced_account")
            return false
        end
    end

end