# frozen_string_literal: true

require 'uri'
require 'net/http'
require 'json'
require 'openssl'

namespace :dexcom_sync do
  task glucose_readings: :environment do
    include LogHelper

    def save_glucose_readings(synced_account, readings)
        begin
            readings.each do |reading|
                parsed_system_time = DateTime.parse(reading["systemTime"])
                parsed_display_time = DateTime.parse(reading["displayTime"])
                existing_reading = GlucoseReading.find_by(synced_account_id: synced_account.id, display_time: parsed_display_time)
                if existing_reading.nil?
                    GlucoseReading.create!(
                        synced_account: synced_account,
                        system_time: parsed_system_time,
                        display_time: parsed_display_time,
                        egv_value: reading["value"],
                        real_time_value: reading["realtimeValue"],
                        smoothed_value: reading["smoothedValue"]
                    )
                end
            end

            deleteable = GlucoseReading.where("system_time < ?", 31.days.ago)
            deleteable.delete_all
            log_info("Pulled Dexcom data for all synced accounts --DexcomSync::GlucoseReadings::save_glucose_readings")
        rescue StandardError => e
            puts '*****************'
            puts "failed #{e}"
            puts '*****************'
            Rollbar.warning("Error syncing glucose devices with #{e}")
          end
    end

    def get_readings(start_date, end_date, synced_account)
        # get new access token
        start = Time.parse(start_date.to_s).strftime('%Y-%m-%dT%H:%M:%S')
        finish = Time.parse(end_date.to_s).strftime('%Y-%m-%dT%H:%M:%S')
        access_token = synced_account.access_token
        # hit the readings endpoint
        url = URI("#{ENV["DEXCOM_EGV_URL"]}?startDate=#{start}&endDate=#{finish}")

        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        request = Net::HTTP::Get.new(url)
        request["authorization"] = "Bearer #{access_token}"

        response = http.request(request)
        readings = JSON.parse(response.read_body)["egvs"]
        return readings || []
    end
 
    # Dexcom api readings
    users_with_associations = User.has_dexcom_association
    if users_with_associations.count > 0
        User.has_dexcom_association.each do |user|
            # update access token using refresh token (plain old ruby object)
    
            # get user's Dexcom device (if exists)
            synced_account = user.synced_accounts.where(account_type: "Dexcom CGM").first
            # check date of last reading
            if synced_account.present?
                DexcomTokenRefresh.new(synced_account).get_access_token
                last_reading = synced_account.glucose_readings&.last
                end_date = Date.today + 1.day
                start_date = nil
                if last_reading.present?
                    start_date = last_reading.system_time
                else
                    start_date = 31.days.ago
                end
                readings = get_readings(start_date, end_date, synced_account)
                # save readings to table (check for duplicates)
                save_glucose_readings(synced_account, readings)
            end
        end
    else
        log_info("Attempted to pull Dexcom data for synced accounts - no accounts exist --DexcomSync::GlucoseReadings")
    end
  end
end
