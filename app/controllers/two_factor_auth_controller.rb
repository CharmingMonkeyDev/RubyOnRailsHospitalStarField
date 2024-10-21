class TwoFactorAuthController < ApplicationController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?

    def new
    end

    def update
        user = User.find(params[:user][:user_id])
        code = params[:user][:code]
        alert_msg = ""
        if user.two_factor_verification_code&.to_s == code && user.two_factor_code_sent_at > (Time.now.utc - 5.minutes)
            user.update!(
                two_factor_verified_at: Time.now,
                two_factor_auth_attempts: 0
            )
            flash[:notice] = "Success!"
        else
            user.increment!(:two_factor_auth_attempts)
            if user.two_factor_code_sent_at < (Time.now.utc - 5.minutes)
                alert_msg = "Your two factor code has expired. Please restart the login process."
            else
                alert_msg = "Incorrect 2FA Code"
            end
            flash[:alert] = alert_msg
        end
        redirect_to root_path
    end
end
