# for documenations https://apiportal-dev.ndiis.org, creds on 1pass
# Sample patients
# Nathan Schatz 2002-05-23  with one return
# James Pharmson 1956-01-17 with multiple return use 211 195TH AVE N, Minot, ND 58701
require 'net/http'
class ProcessNdiisLink
    def initialize(attributes)
        @attributes = attributes
        @user_id = @attributes[:user_id]
    end

    def call
        unless user.patient_ndiis_account.present?
            link_with_ndiis
        end
    end

    private

    attr_accessor  :user_id

    def user
        @user ||= User.find(user_id)
    end

    def link_with_ndiis
        begin
            url = URI("#{ENV["NDIIS_API_END_POINT"]}/external/patient-immunization-forecast/patients/search")
            subscription_key = ENV["NDIIS_API_SUBSCRIPTION_KEY"]
            bearer_token = NdiisToken.new.get_bearer_token
            request_body = {
                "firstName": user.first_name,
                "lastName": user.last_name,
                "dateOfBirth": user.date_of_birth.strftime("%Y-%m-%d")
            }
            
            headers = {
                "Ocp-Apim-Subscription-Key":  subscription_key,
                "Content-Type":  'application/json',
                "Authorization": bearer_token,
            }

            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

            request = Net::HTTP::Post.new(url.path, headers)
            request.body = request_body.to_json
            response = http.request(request)
            if response.code.to_i == 200
                json_response = JSON.parse(response.body)
                ndiis_patient_id = get_ndiis_patient_id(json_response)
                update_ndiis_patient_id(ndiis_patient_id)
            end
        rescue StandardError => e
            Rollbar.warning("Error: #{e} --process_ndiis_link::link_with_ndiis")
            return nil
        end
    end

    def get_ndiis_patient_id(json_response)
        # data looks like this [{"patientId"=>"1ae1b3b4-e584-40a1-810b-728716426e84", "firstName"=>"NATHAN", "lastName"=>"SCHATZ", "birthDate"=>"2002-05-23T00:00:00", 
        # "address1"=>"560 72ND ST SE", "address2"=>"", "city"=>"LINTON", "state"=>"ND", "zip"=>"58552", "ageInMonths"=>254, "ageInWeeks"=>1104, "ageInYears"=>21}]
        ndiis_patient_id = ""
        if json_response.length == 1
            ndiis_patient_id =  json_response.first&.dig("patientId")
        else
            json_response.each do |patient|
                address = patient&.dig("address1")&.downcase
                city = patient&.dig("city")&.downcase
                state = patient&.dig("state")&.downcase
                zip = patient&.dig("zip")
                if user.address.downcase == address && user.city.downcase == city && user.state.downcase == state && user.zip == zip
                    ndiis_patient_id = patient.dig("patientId")
                end
            end
        end
        return ndiis_patient_id
    end

    def update_ndiis_patient_id(patient_id)
        
        if patient_id.present?
            PatientNdiisAccount.create(user_id: user.id, ndiis_patient_id: patient_id)
        end
    end
end