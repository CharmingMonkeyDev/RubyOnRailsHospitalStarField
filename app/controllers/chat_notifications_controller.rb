class ChatNotificationsController < ApplicationController
  layout "no_login" 

  def edit
    @user = User.find_by_opt_out_key(params[:opt_out_key])
    unless @user 
      redirect_to root_path, alert: "Invalid key for user"
    end
  end

  def update
    @user = User.where(opt_out_key: params[:opt_out_key]).where(mobile_phone_number: params[:mobile_phone_number]).first
    unless @user 
      redirect_back fallback_location: root_path, alert: "Can't find user.  Make sure phone number is correct"
    else 
      @user.update(chat_notify: params[:chat_notify])
      redirect_back fallback_location: root_path, notice: "Settings updated"
    end 
  end
end