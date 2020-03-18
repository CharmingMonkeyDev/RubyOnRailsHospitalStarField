class LegalController < ApplicationController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?

  include JsonHelper
  
  def terms 
    render partial: 'terms'
  end
  
  def accept_terms
    current_user.update!(terms: params[:terms], terms_timestamp: DateTime.now)
    log_info("User ID #{current_user&.id} accepting terms  --LegalController::accept_terms")
    flash[:notice] = "Terms agreement updated"
    json_response('User Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end
end
