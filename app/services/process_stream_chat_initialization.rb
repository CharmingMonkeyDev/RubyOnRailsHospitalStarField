# frozen_string_literal: true
require 'stream-chat'
require 'stream-chat/version'

# Docu: https://getstream.io/chat/docs/ruby/channel_members/?language=ruby&q=update_users

class ProcessStreamChatInitialization
   def initialize(attributes)
        @attributes = attributes
        @current_channel_user_id = @attributes[:current_channel_user_id]
        @channel_id = @attributes[:channel_id]
    end 

    def call
        result = get_chat_data
        Result.new(result, "Chat Channel Initailized", true)
    end

    private

    attr_accessor :current_channel_user_id, :channel_id

    def chat_channel
        @chat_channel ||= ChatChannel.find(channel_id)
    end

    def current_channel_user
        @current_channel_user ||= User.find(current_channel_user_id)
    end

    def client
        @client ||= StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
    end

    def get_user_token
        client.create_token(current_channel_user.uuid)
    end

    def get_current_channel_user_data
        {
            uuid: current_channel_user.uuid,
            name: current_channel_user.name
        }
    end

    def update_and_get_users_in_channel
        chat_channel_users = []
        chat_channel.chat_channel_users.each do |chat_channel_user|
            # why do I want to use admin role here? because getstrem wants a role and admin role here mean admin role to the chat window only
            chat_channel_users << {
                id: chat_channel_user.user.uuid,
                role: "admin",
                name: chat_channel_user.user.name
            }
        end
        client.update_users(chat_channel_users)
        chat_channel_users.map{|m| m[:id]}
    end

    def get_chat_data
        {
            get_stream_api_key: ENV['GETSTREAM_API_KEY'],
            user_token: get_user_token,
            current_channel_user: get_current_channel_user_data,
            uniq_channel_id: chat_channel.uniq_channel_id,
            users_in_channel: update_and_get_users_in_channel,
            chat_channel_name: chat_channel.name,
        }
    end
end