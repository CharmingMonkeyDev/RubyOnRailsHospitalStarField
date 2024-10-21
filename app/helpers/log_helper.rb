module LogHelper
  def log_info(message)
    Rails.logger.info(message)
  end
  
  def log_errors(e)
    Rails.logger.error(e)
    Rails.logger.error(e.backtrace.join("\n"))
  end 
end