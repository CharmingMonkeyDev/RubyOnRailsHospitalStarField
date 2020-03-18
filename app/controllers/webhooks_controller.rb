require 'stream-chat'

class WebhooksController < ApplicationController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?
  skip_before_action :verify_authenticity_token

  def get_stream 
    # validate signature
    client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
    valid = client.verify_webhook(request.body.string, request.headers["x-signature"])
    unless valid
      render json: {message: "invalid signature"}, status: 500
      return 
    end

    case params[:type]
    when "user.unread_message_reminder"
      chat_channel_user = ChatChannelUser.find_by_chat_user(params["user"]["id"])
      SendChatNotification.new(chat_channel_user).call
      render json: {message: "Handling event"}, status: 200
      return
    end 
    render json: {message: "Doing nothing on this event"}, status: 200
  end 
end