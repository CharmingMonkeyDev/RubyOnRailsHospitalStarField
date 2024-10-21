# frozen_string_literal: true
require 'jwt'

class ApplicationController < ActionController::Base
  before_action :authenticate_user!    
  include LogHelper

  protected
    def restrict_access_to_reporting_app
        allowed_url = ENV["NDM_REPORTING_APP_URL"]
        #implment api authentication here
        # unless request.referrer == allowed_url
        #   render plain: 'Unauthorized', status: :unauthorized
        # end
    end

  private 
    def verify_two_factor
        if user_signed_in?
            if !current_user.two_factor_verified_at.present? || (current_user.two_factor_verified_at < current_user.two_factor_code_sent_at)
                redirect_to two_factor_auth_path
            end
        end
    end

    def verify_customer_selection
        if user_signed_in?  
            if current_user.customer_selection.present? 
                active_assigned_customer_ids = current_user.customer_users.where(status: "accepted").pluck(:customer_id)
                @customers = Customer.where(id: active_assigned_customer_ids)
                @selected_customer = current_user.customer_selection
            else
                if current_user.role == "patient"
                    first_customer = current_user.customer_users.where(status: "accepted").first&.customer
                    CustomerSelection.create(user: current_user, customer: first_customer, do_not_ask: true)
                end
                redirect_to new_customer_selection_path
            end
            
        end
    end

    def after_sign_out_path_for(*)
        new_user_session_path
    end

    def check_privilege(privilege_type)
        return false if current_user.get_user_privileges.empty?
        return current_user.get_user_privileges.select{|privilege| privilege["name"] == privilege_type}.first["privilege_state"]
    end

    # securely retrieves patient based on patient_id
    def get_patient(patient_id)
      if current_user.is_patient? 
        current_user
      else       
        current_user.get_patients&.find_by_id(patient_id)
      end
    end

    def authenticate_reporting_app
        token = request.headers['Authorization']&.split(' ')&.last
        secret_key = ENV["NDM_API_SECRET"]
        decoded_token = JWT.decode(token, secret_key, false)
        current_timestamp = Time.now.to_i
        token_timestamp = decoded_token[0]['timestamp']
        token_timestamp > current_timestamp - 60.minutes 
    rescue JWT::DecodeError => e
        head :unauthorized
    end
end
