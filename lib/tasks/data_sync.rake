# frozen_string_literal: true

require 'net/http'
require 'json'

namespace :data_sync do
  task gluecose_readings: :environment do
    # iGluecose api readings #
    device_ids = []
    User.where(role: 'patient').each do |user|
      if user.patient_device.identifier.present? && user.patient_device.identifier.length.positive?
        device_ids.push(user.patient_device.identifier)
      end
    end

    reading_ids = PatientDeviceReading.all.pluck(:reading_id)
    patient_devices = PatientDevice.all

    begin
      uri = URI("#{ENV['IGLUCOSE_DEVICE_URL']}readings/")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
      request.body = {
        'api_key' => ENV['IGLUCOSE_DEVICE_API_KEY'],
        'device_ids' => device_ids
      }.to_json
      result = http.request(request)
      device_readings = JSON.parse(result.body)

      device_readings['readings'].each do |reading|
        next if reading_ids.include? reading['reading_id'].to_s && (reading['reading_type'] == 'blood_glucose')

        patient_device = patient_devices.where(identifier: reading['device_id']).first
        next unless patient_device.present? && DateTime.parse(reading['date_recorded']) >= (DateTime.now - 30)

        patient_device.patient_device_readings.create!(
          reading_id: reading['reading_id'],
          reading_type: reading['reading_type'],
          reading_value: reading['blood_glucose_mgdl'],
          date_recorded: DateTime.parse(reading['date_recorded'])
        )
        puts "INSERTED VALUE: #{reading['reading_id']}"
      end
    rescue StandardError => e
      puts '*****************'
      puts "failed #{e}"
      puts '*****************'
      Rollbar.warning("Error syncing glucose devices with #{e}")
    end
  end
end
