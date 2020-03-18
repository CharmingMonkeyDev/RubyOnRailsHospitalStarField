# frozen_string_literal: true
require 'net/http'
require 'json'

# TODO - this code is no longer needed.  Save in case we change strategy.
namespace :chat_notifications do
  task sms: :environment do
    def process_channels(chat_users, channels)
      channels.each do |channel|
        channel["read"].each do |read|
          if read["unread_messages"] > 0 
            chat_users << read["user"]["id"]
          end 
        end 
      end 
    end 

    def send_messages(chat_users)
      chat_channel_users = ChatChannelUser.where(chat_user:chat_users).includes(:user)
      chat_channel_users.each do |ccu|
        SendChatNotification.new(ccu).call
        sleep(0.1)
      end 
    end 

    # main
    client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
    all_chat_users = ChatChannelUser.where(user_type: "patient").pluck(:chat_user).uniq 
    run_loop = true 
    yesterday = (DateTime.now - 1.day).utc.iso8601
    chat_users = []
    loop_count = 0
    offset = 0

    while(run_loop) do 
      break if loop_count > 100000
      loop_count += 1
      begin 
        res = client.query_channels({
          'last_message_at' => {'$gt' => yesterday},
          'members' => {'$in' => all_chat_users}
        },
          sort: { 'last_message_at' => 1 },
          limit: 30,
          offset: offset,
        )
        channels = res["channels"]
        break if channels.empty?
        process_channels(chat_users, channels)
        chat_users = chat_users.uniq
        send_messages(chat_users)
      rescue => e  
        Rails.logger.error {e}
        if retry_count < 3 
          retry_count += 1
          retry 
        end 
      end
      offset += 30 
    end #while loop
  end
end