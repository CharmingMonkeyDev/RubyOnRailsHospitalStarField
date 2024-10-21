require 'uri'
require 'net/http'
require 'json'

class DexcomTokenRefresh
    def initialize(synced_account)
        @synced_account = synced_account
    end

    def get_access_token
        url = URI(ENV["DEXCOM_TOKEN_URL"])

        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        request = Net::HTTP::Post.new(url)
        request["content-type"] = 'application/x-www-form-urlencoded'
        request["cache-control"] = 'no-cache'
        request.body = "client_secret=#{(ENV['DEXCOM_CLIENT_SECRET']).to_s}&client_id=#{(ENV['DEXCOM_CLIENT_ID']).to_s}&refresh_token=#{@synced_account.refresh_token}&grant_type=refresh_token&redirect_uri=#{(ENV['DEXCOM_REDIRECT_URL']).to_s}"

        response = http.request(request)
        token = JSON.parse(response.read_body)["access_token"]
        @synced_account.update!(access_token: token)
    end
end 