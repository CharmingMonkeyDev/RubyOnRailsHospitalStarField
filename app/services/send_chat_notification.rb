
class SendChatNotification
  def initialize(chat_channel_user)
    @chat_channel_user = chat_channel_user
  end

  def call
    Rails.logger.debug {"calling SendChatNotification"}
    user = @chat_channel_user.user

    if user.is_patient? && user.chat_notify && user.user_creation_type == "invited"
      message = UnreadMessageSms.text(user)
      TextSms.new(user.mobile_phone_number, message).send
    else 
      Rails.logger.debug {"No sms sent for user #{user.id}, user.is_patient? #{user.is_patient?}, user.chat_notify #{user.chat_notify}"}
      Rollbar.warning("No sms sent for user #{user.id}, user.is_patient? #{user.is_patient?}, user.chat_notify #{user.chat_notify}")
    end 
  end
end