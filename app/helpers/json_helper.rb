# frozen_string_literal: true

module JsonHelper
  def json_response(message, status)
    result = status == 200 ? { message: message } : { error: message }
    # log if error
    if status != 200 
      Rails.logger.error(message)
      Rails.logger.error(message.backtrace.join("\n")) if message.try(:backtrace)
    end
    render json: result, status: status
  end

  def json_data_response(data)
    render json: { data: data }
  end
end
