class ProvidersController < ApplicationController
  include JsonHelper  
  #used for edit profile of provider
  def edit_provider
    provider = current_user
    previous_email = provider.email
    provider.update!(edit_strong_params)
        
    flash[:notice] = "Profile has been updated."
    log_info("User ID #{current_user&.id} updated User information for User ID #{provider&.id} --ProvidersController::edit_provider")
    json_response('Provider Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end
  
  def edit_strong_params
    permited_params = %i[first_name middle_name last_name email mobile_phone_number date_of_birth]
    params.require(:user).permit(permited_params)
  end
end 