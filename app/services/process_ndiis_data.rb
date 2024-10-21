class ProcessNdiisData
    def initialize(attributes)
        @attributes = attributes
        @user_id = @attributes[:user_id]
    end

    def call
        get_ndiis_data
    end

    private

    attr_accessor  :user_id

    def user
        @user ||= User.find(user_id)
    end

    def get_ndiis_data
        json_data = fetch_from_ndiis
    end

    def fetch_from_ndiis
        ndiis_patient_id = user.patient_ndiis_account.ndiis_patient_id
        url = URI("#{ENV["NDIIS_API_END_POINT"]}/external/patient-immunization-forecast/forecasts/#{ndiis_patient_id}")
        subscription_key = ENV["NDIIS_API_SUBSCRIPTION_KEY"]
        bearer_token = NdiisToken.new.get_bearer_token

        headers = {
            "Ocp-Apim-Subscription-Key":  subscription_key,
            "Authorization": bearer_token,
        }

        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true

        request = Net::HTTP::Get.new(url.path, headers)
        response = http.request(request)
        if response.code.to_i == 200
            json_response = JSON.parse(response.body)
            update_immunization_forecast(json_response)
            update_immunization_historical(json_response)
        end
    end

    def update_immunization_forecast(json_response)
        forecast_immunizations = json_response.dig("forecastImmunizations")
        forecast_immunizations.each do |forecast|
            # data sample: {"vaccineType"=>"Men B", "doseNumber"=>1, "recommendedDate"=>"2018-05-23T00:00:00", "minimumValidDate"=>"2018-05-23T00:00:00"}
            PatientForecastImmunization.create(
                user_id: user.id,
                vaccine_type: forecast.dig("vaccineType"),
                dose_number: forecast.dig("doseNumber"),
                recommended_date: forecast.dig("recommendedDate"),
                minimum_valid_date: forecast.dig("minimumValidDate"),
            )
        end
        update_removed_forecast(forecast_immunizations)
    end

    def update_immunization_historical(json_response)
        historical_immunizations = json_response.dig("historicalImmunizations")
        historical_immunizations.each do |historic|
            # data sample: {"vaccineName"=>"DTaP", "immunizationDate"=>"2002-08-08T00:00:00"}
            PatientHistoricalImmunization.create(
                user_id: user.id,
                vaccine_name: historic.dig("vaccineName"),
                immunization_date: historic.dig("immunizationDate")
            )
        end
    end

    def update_removed_forecast(ndiis_forecast)
        existing_forecasts = user.patient_forecast_immunizations.where(is_deleted: false)
        removed_forecast_ids = []
        existing_forecasts.each do |forecast|
            matching_forecast = ndiis_forecast.select{|nf| nf["vaccineType"] == forecast.vaccine_type && nf["doseNumber"] == forecast.dose_number && nf["minimumValidDate"] == forecast.minimum_valid_date.strftime('%Y-%m-%dT%H:%M:%S')}
            unless matching_forecast.present?
                forecast.update(is_deleted: true)
            end
        end
    end
end