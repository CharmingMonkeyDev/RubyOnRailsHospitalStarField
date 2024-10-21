class UnreadMessageSms
  def self.text(user) 
      url_helper = Rails.application.routes.url_helpers
"You have new messages from your provider at #{APP_NAME}. Login at the link provided.
#{url_helper.new_user_session_url}

If you would no longer like to receive these messages, please click the second provided link below.
#{url_helper.edit_chat_notification_url(id: user.id, opt_out_key: user.opt_out_key)}"
    end
end