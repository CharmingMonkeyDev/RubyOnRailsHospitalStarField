# frozen_string_literal: true

require 'stream-chat'
require 'stream-chat/version'

class ChatChannelController < ApplicationController
  before_action :verify_two_factor
  before_action :verify_customer_selection

  include JsonHelper
  include ChannelHelper

  def create
    new_channel_user_ids = get_channel_user_ids(chat_channel_strong_params)
    duplicate_channel = check_duplicate_channels(new_channel_user_ids)

    if duplicate_channel.present?
      json_data_response({ message: 'Channel already exists', duplicate_channel: duplicate_channel })
    else
      users = User.find(new_channel_user_ids)
      channel = current_user.chat_channels.create!(name: chat_channel_strong_params[:name])
      users.each do |user|
        created_channel = channel.chat_channel_users.create!(user_id: user.id, chat_user: "#{user.id}-#{user.role}",
                                           user_type: user.role)
        log_info("User ID #{current_user&.id} created ChatChannel ID #{channel&.id} for User ID #{user&.id} -- ChatChannelController::create")
      end

      flash[:notice] = "#{chat_channel_strong_params[:name]} channel has been created"
      log_info("User ID #{current_user&.id} access messages, chat_channels for channel ID #{channel&.id} -- ChatChannelController::create")
      json_data_response({ message: "#{chat_channel_strong_params[:name]} channel has been created",
                           new_channel_id: channel.id })
    end
  rescue StandardError => e
    json_response(e, 500)
  end

  def initiate_chat
    channel = ChatChannel.find_by_id(params[:channel_id])
    client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
    current_chat_channel_user = nil
    user_list = []
    channel.chat_channel_users.each do |channel_user|
      user_list.push({
                       id: channel_user.chat_user,
                       role: 'admin',
                       name: channel_user.user.name
                     })

      current_chat_channel_user = channel_user if current_user.id == channel_user.user_id
    end
    client.update_users(user_list)
    log_info("User ID #{current_user&.id} accessed user_token, current_chat_user, users_in_channel for channel ID #{channel&.id} -- ChatChannelController::initiate_chat")
    json_data_response({ message: 'Chat Initiated',
                         user_token: client.create_token(current_chat_channel_user.chat_user), 
                         current_chat_user: current_chat_channel_user,
                         users_in_channel: channel.chat_channel_users.pluck('chat_user') })
  rescue StandardError => e
    json_response(e, 500)
  end

  # TODO, this may not be used anymore.  Can we remove?
  def add_to_chat
    channel = ChatChannel.find_by_id(params[:chat_channel][:current_channel_id])

    user_name_string = ''
    params[:chat_channel][:users_list].each do |user_id|
      user = User.find_by_id(user_id.to_i)
      channel.chat_channel_users.create!(user_id: user.id, chat_user: "#{user.id}-#{user.role}",
                                         user_type: user.role)
      user_name_string = "#{user_name_string} #{user.name}"
      log_info("User ID #{current_user&.id} added user ID #{user&.id} to channel ID #{channel&.id} -- ChatChannelController::add_to_chat")
    end

    if channel
      channel_name = current_user.name
      channel.chat_channel_users.each do |chat_channel_user|
        channel_name = "#{channel_name}, #{chat_channel_user.user.name}"
      end
      channel.update!(name: channel_name)
    end

    flash[:notice] = "#{user_name_string} added to channel: #{channel.name}"
    json_data_response({ message: 'Added to chat' })
  rescue StandardError => e
    json_response(e, 500)
  end

  private

  def chat_channel_strong_params
    permited_params = %i[name patient colleagues]
    params.require(:chat_channel).permit(permited_params)
  end
end
