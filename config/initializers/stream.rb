require 'stream-chat'
require 'stream-chat/version'
client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
# enable reminders for the channel type `messaging`
# client.update_channel_type("messaging", reminders: true)
# client.update_channel_type("team", reminders: true)
# # change reminders interval to 1 hour (interval in seconds)
# client.update_app_settings(reminders_interval: 43200);