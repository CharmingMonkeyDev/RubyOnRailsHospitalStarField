# frozen_string_literal: true

module PatientDeviceHelper
  def device_lookup(identifier)
    uri = URI("#{ENV['IGLUCOSE_DEVICE_URL']}devices/validate/")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
    request.body = {
      'api_key' => ENV['IGLUCOSE_DEVICE_API_KEY'],
      'device_id' => identifier
    }.to_json
    result = http.request(request)
    device_object = JSON.parse(result.body)
    device_object['is_valid']
  end
end
