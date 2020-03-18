#config/initializers/lograge.rb
Rails.application.configure do
    # Lograge config
    config.lograge.enabled = true
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.lograge.keep_original_rails_log = true
    config.lograge.custom_options = lambda do |event|
    { :params => event.payload[:params] }
    end
end