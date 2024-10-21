class ChangeHealthcareApi
    def validate_data(json_data)
        begin
            token = get_bearer_token
            url = URI.parse("#{ENV["CHANGE_HEATHCARE_API_URL"]}/medicalnetwork/professionalclaims/v3/validation")
            headers = {
                "Content-Type" => "application/json",
                'Authorization' => "Bearer #{token}"
            }

            # Create an HTTP request
            request = Net::HTTP::Post.new(url.path, headers)
            request.body = json_data.to_json

            # Create an HTTP client
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

            # Send the request
            response = http.request(request)
            json_response = JSON.parse(response.body)
            return json_response
        rescue StandardError => e
            Rollbar.warning("Error: #{e} --ChangeHealthcareApi::validate_data")
            return nil
        end
    end

    def submit_data(json_data)
        begin
            token = get_bearer_token
            url = URI.parse("#{ENV["CHANGE_HEATHCARE_API_URL"]}/medicalnetwork/professionalclaims/v3/submission")
            headers = {
                "Content-Type" => "application/json",
                'Authorization' => "Bearer #{token}"
            }

            # Create an HTTP request
            request = Net::HTTP::Post.new(url.path, headers)
            request.body = json_data.to_json

            # Create an HTTP client
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

            # Send the request
            response = http.request(request)
            json_response = JSON.parse(response.body)
            return json_response
        rescue StandardError => e
            Rollbar.warning("Error: #{e} --ChangeHealthcareApi::submit_data")
            return nil
        end
    end

    private

    def get_bearer_token
        begin
            url = URI.parse("#{ENV["CHANGE_HEATHCARE_API_URL"]}/apip/auth/v2/token")
            body_data = {
                "client_id": ENV["CHANGE_HEALTHCARE_CLIENT_ID"],
                "client_secret": ENV["CHANGE_HEALTHCARE_CLIENT_SECRET"],
                "grant_type": "client_credentials"
            }

            headers = {
                "Content-Type" => "application/json",
            }

            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

            request = Net::HTTP::Post.new(url.path, headers)
            request.body = body_data.to_json

            response = http.request(request)

            token = JSON.parse(response.body).dig("access_token")
            return token
        rescue StandardError => e
            Rollbar.warning("Error: #{e} --ChangeHealthcareApi::get_bearer_token")
            return nil
        end
    end

end