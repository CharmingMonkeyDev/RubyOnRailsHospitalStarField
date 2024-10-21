class BoardMessagesController < ApplicationController
    def index
        customer = current_user.customer_selection.customer 
        board_messages = BoardMessage.includes(:user).where(customer_id: customer.id).order(created_at: :desc)
        render json: Result.new({board_messages: board_messages.as_json(include: :user)}, "Messages successfully fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --BoardMessagesController#index")
        render json: Result.new(nil, "Messages cannot be fetched", false), status: 500
    end

    def create
        customer = current_user.customer_selection.customer 
        board_message = BoardMessage.create(
            user_id: current_user.id,
            customer_id: customer.id,
            message: permit_params[:message]
        )
        render json: Result.new(board_message, "Message successfully created", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --BoardMessagesController#create")
        render json: Result.new(nil, "Message cannot be created", false), status: 500
    end

    def destroy 
        board_message = BoardMessage.find(params[:id])
        board_message.destroy
        render json: Result.new(nil, "Message successfully deleted", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --BoardMessagesController#destroy")
        render json: Result.new(nil, "Message cannot be deleted", false), status: 500
    end

    private
    def permit_params
        params.require(:board_message).permit(:message)
    end
end
