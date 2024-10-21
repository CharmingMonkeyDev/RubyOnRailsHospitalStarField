class NdhinData

    def initialize
    end

    def get_access_token
        # this method gets access token from NDHIN before each request
        token = ''
        begin
            uri = URI((ENV['ACCESS_TOKEN_ENDPOINT']).to_s)
            request = Net::HTTP::Post.new(
                uri.path, 
                {
                    'Content-Type' => 'application/x-www-form-urlencoded',
                    'Accept-Encoding' => 'gzip, defalte, br',
                    'Accept' => '*/*'
                }
            )
            request.basic_auth (ENV['ACCESS_TOKEN_AUTH_USERNAME']).to_s, (ENV['ACCESS_TOKEN_AUTH_PASSWORD']).to_s
            request.set_form_data(
                {
                    'grant_type' => 'password',
                    'username' => (ENV['ACCESS_TOKEN_USERNAME']).to_s,
                    'password' => (ENV['ACCESS_TOKEN_PASSWORD']).to_s
                }
            )
            Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
                result = http.request(request)
                token_response = JSON.parse(result.body)
                token = token_response['access_token']
            end
        rescue StandardError => e
            puts '*****************'
            puts "failed #{e}"
            puts '*****************'
            Rollbar.warning("Error syncing patient data with #{e}")
        end
        token
    end

    def get_ndhin_patient_indentifier(user)
        access_token = get_access_token
        id = ''

        birth_date = user.date_of_birth.strftime('%Y%m%d')
        first_name = user.first_name
        last_name = user.last_name

        # Sample Data for NDHIN staging
        # birth_date = "19801017"
        # first_name = "tester"
        # last_name = "test"

        begin
            url = URI("#{ENV['PATIENT_DATA_ENDPOINT']}Patient?family=#{last_name}&given=#{first_name}&birthdate=#{birth_date}")
            https = Net::HTTP.new(url.host, url.port)
            https.use_ssl = true

            request = Net::HTTP::Get.new(url)
            request['Authorization'] = "Bearer #{access_token}"
            patient_search = https.request(request).read_body

            xmlData = Nokogiri::XML(patient_search)
            xmlData.remove_namespaces!

            identifier_tags = xmlData.xpath('//Patient//identifier')

            identifier_tags.each do |identifier_tag|
                children = identifier_tag.children
                ndhin_identifier_found = false
                children.each do |child|
                    if child.name == "system" && child&.attributes&.dig("value")&.value == "NDHIN"
                        ndhin_identifier_found = true
                    end

                    if child.name == "value" && ndhin_identifier_found == true
                        id = child.attributes.dig("value").value
                        ndhin_identifier_found = false
                        break
                    end
                end 
            end

            # this is old code, I kinda wanted to keep this as reference 
            # patientIdentiers = xmlData.xpath('//Patient//identifier//value/@value')
            # patientIdentiers.each do |patientIdentier|
            #     identifier = patientIdentier.to_s if identifier.length.zero? && patientIdentier.to_s.include?('-')
            # end

            id
        rescue StandardError => e
            puts '*****************'
            puts "failed #{e}"
            puts '*****************'
            Rollbar.warning("Error syncing patient data with #{e}")
        end
        id
    end

    def get_diagnostic_report(patient_identifier)
        report = ''
        access_token = get_access_token
        begin
            url = URI("#{ENV['PATIENT_DATA_ENDPOINT']}DiagnosticReport/?patient.identifier=NDHIN%7C#{patient_identifier}")
            https = Net::HTTP.new(url.host, url.port)
            https.use_ssl = true

            request = Net::HTTP::Get.new(url)
            request['Authorization'] = "Bearer #{access_token}"
            report = https.request(request).read_body
        rescue StandardError => e
            puts '*****************'
            puts "failed #{e}"
            puts '*****************'
            Rollbar.warning("Error syncing patient data with #{e}")
        end
        report
    end 
end