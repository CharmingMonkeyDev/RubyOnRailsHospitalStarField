# frozen_string_literal: true

class ProcessChatChannelCreation
    def initialize(attributes)
        @attributes = attributes
        @chat_channel_owner_user_id = @attributes[:chat_channel_owner_user_id]
        @chat_channel_member_user_id = @attributes[:chat_channel_member_user_id]
    end

    def call
        channel = process_chat_channel_creation
        if channel
            Result.new(channel, "Channel Successfully Created", true)
        else
            Result.new(nil, "Channel cannot be created", false)
        end
    end

    private

    attr_accessor :chat_channel_owner_user_id, :chat_channel_member_user_id

    def chat_channel_owner_user
        @chat_channel_owner_user ||= User.find(chat_channel_owner_user_id)
    end

    def chat_channel_member_user
        @chat_channel_member_user ||= User.find(chat_channel_member_user_id)
    end

    def process_chat_channel_creation
        existing_channel_id = get_existing_channel_id
        if existing_channel_id.present?
            channel = ChatChannel.find(existing_channel_id)
            channel.update!(active: true)
        else
            channel = create_new_channel
        end
        channel
    end

    def get_existing_channel_id
        chat_channel_ids = ChatChannelUser.where(user_id: chat_channel_owner_user.id)&.pluck(:chat_channel_id)&.uniq
        previous_channel_of_owner_and_user_ids = ChatChannelUser.where(user_id: chat_channel_member_user.id, chat_channel_id: chat_channel_ids)&.pluck(:chat_channel_id)&.uniq
        existing_channel_id = nil
        previous_channel_of_owner_and_user_ids.each do |channel_id|
            existing_channel_user_ids = ChatChannelUser.where(chat_channel_id: channel_id).pluck(:user_id)
            if existing_channel_user_ids.sort == [chat_channel_owner_user_id, chat_channel_member_user_id].sort
                existing_channel_id = channel_id
            end
        end
        existing_channel_id
    end

    def create_new_channel
        chat_channel_name =  "#{chat_channel_owner_user.name}, #{chat_channel_member_user.name}"
        channel = nil
        ActiveRecord::Base.transaction do
            channel = ChatChannel.create!(
                user_id: chat_channel_owner_user_id,
                name: chat_channel_name,
                active: true
            )

            channel.chat_channel_users.create!(
                user_id: chat_channel_owner_user_id,
                chat_user: chat_channel_owner_user.uuid,
                user_type: chat_channel_owner_user.role,
            )

            channel.chat_channel_users.create!(
                user_id: chat_channel_member_user_id,
                chat_user: chat_channel_member_user.uuid,
                user_type: chat_channel_member_user.role,
            )
        end
        channel
    end
end