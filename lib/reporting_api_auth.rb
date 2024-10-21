require 'jwt'

module ReportingApiAuth
  def self.generate_token
    secret_key = ENV["NDM_API_SECRET"]
    current_timestamp = Time.now.to_i
    payload = { timestamp: current_timestamp }
    token = JWT.encode(payload, secret_key, 'HS256')
  end
end
