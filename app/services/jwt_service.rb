class JwtService
  attr_accessor :payload, :secret_key, :jwt_token

  def initialize(payload: {}, jwt_token: nil)
    @payload = payload
    @secret_key = ENV["NDM_API_SECRET"]
    @jwt_token = jwt_token
  end

  def encode
    JWT.encode(payload, secret_key, 'HS256')
  end

  def decode
    JWT.decode(jwt_token, secret_key, false)
  end
end