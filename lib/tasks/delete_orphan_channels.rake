require 'net/http'
require 'json'
require 'stream-chat'
require 'stream-chat/version'
require 'date'

namespace :chat do
  desc "Deleted orphan data from the db and stream chat api"
  task delete_orphan_channels: :environment do
    # There might be orphan chat channels which might not have related chat_chatnnel_users. Firstly delete those locally.
    chat_channels = ChatChannel.all
    chat_channels.each do |chat_channel|
      if chat_channel.chat_channel_users.empty?
        chat_channel.delete
      end
    end

    # Secondly get all the channels from Stream Chat Api by following 3 lines of code:
    client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
    all_channels_on_stream_chat_response = client.query_channels({type: "messaging"})
    all_channels_on_stream_chat = all_channels_on_stream_chat_response["channels"]
    #Loop through each of those channels
    all_channels_on_stream_chat.each do |stream_chat_channel|
      stream_chat_channel_id =  stream_chat_channel["channel"]["id"]
      # Find the channel with that id locally. 
      local_channel = ChatChannel.find_by_uniq_channel_id(stream_chat_channel_id)
      # If we don't have any channel locally, delete it from StreamChannel API as well.
      if local_channel.nil? or local_channel.chat_channel_users.empty?
        begin
          client.delete_channels(["messaging:#{stream_chat_channel_id}"], hard_delete: false)
          Rails.logger.info("Deleted channel on Stream chat api with id: #{stream_chat_channel_id}")
        rescue Exception => e
          Rails.logger.error {e}
        end
      end
    end
  end
end
