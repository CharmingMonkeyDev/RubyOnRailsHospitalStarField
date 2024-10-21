class DataFetching::CoreTeamsController < ApplicationController
    include JsonHelper
    def index
        selected_customer = current_user.customer_selection.customer
        # actively_assigned_user_ids =  selected_customer.customer_users.pluck(:user_id).uniq
        provider_users = selected_customer.users.where.not(role: "patient").order(:last_name)
        if params[:first_name].present?
            provider_users = provider_users.where("lower(first_name) ILIKE ? ", "%#{params[:first_name]}%")
        end

        if params[:last_name].present?
            provider_users = provider_users.where("lower(last_name) ILIKE ? ", "%#{params[:last_name]}%")
        end
        log_info("User ID #{current_user&.id} accessed provider list for Customer ID #{selected_customer&.id} --DataFetching::CoreTeamsController::index")
        result = {
            providers: provider_users.order(:last_name)
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, "Data fetched", false), status: 500
    end

    def core_team_customer_association_index
        user = User.find(params[:user_id])
        customer_users = user.customer_users.order(:status)
        accepted_count = customer_users.where(status: "accepted").count

        tz = params[:tz].present? ? params[:tz] : "Central Time (US & Canada)"
        zone = ActiveSupport::TimeZone.new(tz)

        formatted_customer_users = []
        customer_users.each do |cu|
            formatted_assigned_at = cu.assigned_at.in_time_zone(zone)
            new_cu = cu.as_json
            new_cu[:formatted_assigned_at] = formatted_assigned_at&.strftime("%m/%d/%Y")
            new_cu[:formatted_assigned_at_time] = formatted_assigned_at&.strftime("%l:%M %P")
            formatted_customer_users << new_cu
        end

        result = {
            customer_associations: formatted_customer_users,
            deletable: accepted_count > 1
        }
        log_info("User ID #{current_user&.id} accessed customer user association for user  #{user&.id} --DataFetching::CoreTeamsController::core_team_customer_association_index")
        
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --DataFetching::CoreTeamsController::core_team_customer_association_index")
        render json: Result.new(nil, e, false), status: 500
    end

    def show
        provider = User.find(params[:id])
        result = {
            id: provider.id,
            name: provider.name,
            email: provider.email,
            first_name: provider.first_name,
            middle_name: provider.middle_name,
            last_name: provider.last_name,
            mobile_phone_number: provider.mobile_phone_number,
            business_phone_number: provider.business_phone_number,
            role: provider.role,
            provider_npi_number: provider.provider_npi_number
        }
        log_info("User ID #{current_user&.id} accessed id, name, email, mobile_phone_number for user ID #{provider&.id} --CoreTeamsController::show")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --DataFetching::CoreTeamsController::show")
        json_response(e, 500)
    end
end
