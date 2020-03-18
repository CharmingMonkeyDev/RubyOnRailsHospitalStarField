# frozen_string_literal: true
class ChatsController < ApplicationController
    def create
        user = current_user
        to_be_added_user = User.find(params[:user_id])
        result = ProcessChatChannelCreation.new({chat_channel_owner_user_id: user.id, chat_channel_member_user_id: to_be_added_user.id}).call
        if result.success?
            render json: result, status: 200
            return
        else
            render json: result, status: 500
            return
        end
    rescue StandardError => e
        render json: Result.new(nil, e, false), status: 500
    end

end
