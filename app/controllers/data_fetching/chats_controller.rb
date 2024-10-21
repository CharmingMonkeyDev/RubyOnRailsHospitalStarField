# frozen_string_literal: true
require 'stream-chat'
require 'stream-chat/version'

class DataFetching::ChatsController < ApplicationController
   
    def index
        user = current_user
        user_active_channel_ids = ChatChannelUser.joins(:chat_channel).where("chat_channels.active = ?", true).where(user_id: user.id)&.pluck(:chat_channel_id)
        member_user_ids = ChatChannelUser.where(chat_channel_id: user_active_channel_ids).where.not(user_id: user.id)&.pluck(:user_id)&.uniq
        patient_user_ids = User.where(id: member_user_ids, role: "patient").pluck(:id)
        provider_user_ids = User.where(id: member_user_ids).where.not(role: "patient").pluck(:id)

        patient_chat_channel_ids = ChatChannelUser.where(chat_channel_id: user_active_channel_ids, user_id: patient_user_ids)&.pluck(:chat_channel_id)
        patient_chat_channels = ChatChannel.where(id: patient_chat_channel_ids)

        provider_chat_channel_ids = ChatChannelUser.where(chat_channel_id: user_active_channel_ids, user_id: provider_user_ids)&.pluck(:chat_channel_id)
        provider_chat_channels = ChatChannel.where(id: provider_chat_channel_ids).where.not(id: patient_chat_channel_ids)

        result = {
            channel_with_patients: sanitize_channels(patient_chat_channels),
            channel_with_colleagues: sanitize_channels(provider_chat_channels),
        }
        log_info("User ID #{current_user&.id} accessed chat window #{user&.id} --DataFetching::ChatsController::index")
        render json: Result.new(result, "User Channel Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::index")
        render json: Result.new(nil, e, false), status: 500
    end

    def get_providers_chat_new
        channel = ChatChannel.find(params[:channel_id])
        user = current_user
        existing_channel_user_ids = channel&.chat_channel_users&.pluck(:user_id)
        selected_customer = user.customer_selection.customer
        providers_for_customer = selected_customer.users.where.not(role: "patient").where.not(id: existing_channel_user_ids)
        result = {
            provider_users: providers_for_customer
        }
        log_info("User ID #{current_user&.id} accessed list of providers from channel #{existing_channel_user_ids} --DataFetching::ChatsController::get_providers_chat_new")
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::get_providers_chat_new")
        render json: Result.new(nil, e, false), status: 500
    end

    def get_users_without_channel
        user = current_user
        selected_customer = user.customer_selection.customer
        current_user_channel_ids = ChatChannelUser.joins(:chat_channel).where(user_id: user.id).where("chat_channels.active = ?", true).pluck(:chat_channel_id)
        existing_channel_user_ids = ChatChannelUser.where(chat_channel_id: current_user_channel_ids).where.not(user_id: user.id).pluck(:user_id)&.uniq
        users = []
        if params[:role_type] == "patient"
            users = selected_customer.users.active.where(role: "patient").where.not(id: existing_channel_user_ids)
        elsif params[:role_type] == "provider"
            users = selected_customer.users.active.where.not(role: "patient").where.not(id: existing_channel_user_ids).where.not(id: current_user.id)
        end
        result = {
            userList: users
        }
        log_info("User ID #{current_user&.id} accessed user without channel #{users&.ids} --DataFetching::ChatsController::get_users_without_channel")
        render json: Result.new(result, "Users fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::get_users_without_channel")
        render json: Result.new(nil, e, false), status: 500
    end

    def assets
        result = {
            chat_flip_c_to_p_icon: ActionController::Base.helpers.asset_url('flip_icon_c_to_p.png'),
            chat_flip_p_to_c_icon: ActionController::Base.helpers.asset_url('flip_icon_p_to_c.png'),
            chat_close_icon: ActionController::Base.helpers.asset_url('chat_close_icon.png'),
            add_new_user_to_chat_icon: ActionController::Base.helpers.asset_url('add_new_user_to_chat_icon.png'),
            add_new_user_to_chat_patient_icon: ActionController::Base.helpers.asset_url('add_new_user_to_chat_patient_icon.png'),
        }
        log_info("User ID #{current_user&.id} accessed assets for chat page --DataFetching::ChatsController::assets")
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::assets")
        render json: Result.new(nil, e, false), status: 500
    end

    def initialize_chat
        user = current_user
        channel = ChatChannel.find_by_id(params[:channel_id])
        result = ProcessStreamChatInitialization.new({current_channel_user_id: user.id, channel_id: channel.id}).call
        log_info("User ID #{current_user&.id} initialize chat for #{channel&.id} --DataFetching::ChatsController::initialize_chat")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::initialize_chat")
        render json: Result.new(nil, e, false), status: 500
    end
    
    def get_token 
      user = current_user
      client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
      user_token = client.create_token(user.uuid)
      result = {user_token: user_token, stream_api_key: ENV['GETSTREAM_API_KEY'], uuid: user.uuid, name: user.name}
      log_info("User ID #{current_user&.id} requested chat user token -- DataFetching::ChatsController::get_token")
      render json: Result.new(result, "Data Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::get_token")
        render json: Result.new(nil, e, false), status: 500
    end
    
    def add_to_chat
        channel = ChatChannel.find(params[:channel_id])
        selected_user = User.find(params[:selected_user_id])
        channel.chat_channel_users.create!(
            user_id: selected_user.id, 
            chat_user: "#{selected_user.id}-#{selected_user.role}",
            user_type: selected_user.role
        )
        new_channel_name = channel.name + ", " + selected_user.name
        channel.update!(name: new_channel_name) 

        log_info("User ID #{current_user&.id} added User ID #{selected_user&.id} on channel ID #{channel&.id} --DataFetching::ChatsController::add_to_chat")
        render json: Result.new(nil, "Channel Updated", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::add_to_chat")
        render json: Result.new(nil, e, false), status: 500
    end

    def create_new_channel
        user = current_user
        to_be_added_user = User.find(params[:user_id])
        channel = process_channel_creation(user, to_be_added_user)
        if channel.present?
            result = {
                channel_id: channel.id
            }
            render json: Result.new(result, "Channel Created", true), status: 200
            return
        else
            render json: Result.new(nil, "Channel not created", true), status: 500
            return
        end
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::create_new_channel")
        render json: Result.new(nil, e, false), status: 500
    end

    def get_channel_between
        user = User.find(params[:user_id])
        user_channel_ids = ChatChannelUser.joins(:chat_channel).where(user_id: user.id).where("chat_channels.active = ?", true)&.pluck(:chat_channel_id)&.uniq
        user_and_current_user_channel_ids = ChatChannelUser.where(chat_channel_id: user_channel_ids, user_id: current_user.id)&.pluck(:chat_channel_id)
        result = {
            channel_id: user_and_current_user_channel_ids.first
        }
        render json: Result.new(result, "Channel Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::get_channel_between")
        render json: Result.new(nil, e, false), status: 500
    end

    def archive_chat
        channel = ChatChannel.find(params[:channel_id])
        channel.update!(active: false)
        render json: Result.new(nil, "Channel Arhcived", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::ChatsController::archive_chat")
        render json: Result.new(nil, e, false), status: 500
    end

    private

    def sanitize_channels(channels)
        # this method pull info about the other users 
        # for patient it pulls age, sex and full address
        # for provider it pull customer association
        # this is only used for channel with single user

        uniq_ids = channels.pluck(:uniq_channel_id)
        if !uniq_ids.empty?
            sorted_uniq_channel_with_unread_messages = sort_channels_with_unread_count(uniq_ids)
            sorted_uniq_channel_ids = sorted_uniq_channel_with_unread_messages.keys
            channels = channels.sort_by do |channel|
                sorted_uniq_channel_ids.index(channel[:uniq_channel_id])
            end
        end

        final_channels = []

        channels.each do |channel|
            json_channel = channel.as_json
            channel_other_users = channel.chat_channel_users.where.not(user_id: current_user.id)
            clean_name = channel_other_users.as_json.map{|m| m&.dig("user")&.dig("name")}&.join(", ")
            json_channel["clean_name"] = clean_name
            json_channel["unread_count"] = sorted_uniq_channel_with_unread_messages[channel.uniq_channel_id]
            if channel_other_users.length == 1
                user = channel_other_users.first&.user
                json_channel["age"] = user.age
                json_channel["full_address"] = user.full_address
                json_channel["sex"] = user.gender
                json_channel["customers"] = user.get_associated_customer_name
            end
            final_channels << json_channel
        end
        final_channels
    end

    def sort_channels_with_unread_count(unsorted_channel_ids)
        client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])
        data =  client.query_channels(
            { 'id' => { '$in' => unsorted_channel_ids }},
            sort: { 'last_message_at' => -1 }
        )

        sorted_channels_with_unread_count = {}
        data["channels"].each do |channel|
            total_unread_messages = 0
            read = channel["read"]
            read.each do |entry|
                if entry["user"]["id"] == current_user.uuid
                    total_unread_messages += entry["unread_messages"]
                end
            end
            sorted_channels_with_unread_count[channel["channel"]["id"]] = total_unread_messages
        end

        unsorted_channel_ids.each do |id|
            sorted_channels_with_unread_count[id] ||= 0
        end

        return sorted_channels_with_unread_count
    end

end
