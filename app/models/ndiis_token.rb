class NdiisToken
    def initialize
    end

    def get_bearer_token
        begin
            url = URI(ENV["NDIIS_TOKEN_END_POINT"])
            params = {
            "grant_type": "client_credentials",
            "scope": ENV["NDIIS_OAUTH_SCOPE"],
            "client_id": ENV["NDIIS_CLIENT_ID"],
            "client_secret": ENV["NDIIS_CLIENT_SECRET"]
            }

            headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            }

            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

            request = Net::HTTP::Get.new(url.path, headers)
            request.set_form_data(params)

            response = http.request(request)
            token = JSON.parse(response.body).dig("access_token")
            return token
        rescue StandardError => e
            Rollbar.warning("Error: #{e} --process_ndiis_link::get_bearer_token")
            return nil
        end
    end
end