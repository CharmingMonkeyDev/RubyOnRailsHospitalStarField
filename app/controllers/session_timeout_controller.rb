class SessionTimeoutController < Devise::SessionsController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?
  
  prepend_before_action :skip_timeout, only: [:check_session_timeout, :render_timeout]

  def check_session_timeout
    response.headers["Etag"] = "" # clear etags to prevent caching
    # render plain: ttl_to_timeout, status: :ok
    render json: Result.new({response: ttl_to_timeout}, "timeout time sent", true), status: 200
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::invite_patient")
    render json: Result.new(nil, "timeout time not sent", false), status: 500
  end

  def render_timeout
    if current_user.present? && user_signed_in?
      reset_session
      sign_out(current_user)
    end

    flash[:alert] = t("devise.failure.timeout", default: "Your session has timed out.")
    redirect_to new_user_session_path
  end

  def reset_timeout_session
    render json: Result.new({response: ttl_to_timeout}, "timeout reset", true), status: 200
  end

private

  def ttl_to_timeout
    return 0 if user_session.blank?

    Devise.timeout_in - (Time.now.utc - last_request_time).to_i
  end

  def last_request_time
    user_session["last_request_at"].presence || 0
  end

  def skip_timeout
    request.env["devise.skip_trackable"] = true
  end
end
