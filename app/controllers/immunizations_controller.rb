class ImmunizationsController < ApplicationController
    def index
        customer = current_user.customer_selection.customer
        patient_ids =  customer.customer_users.active_or_pending.pluck(:user_id).flatten.uniq
        forecast = PatientForecastImmunization.includes(:user).where(user_id: patient_ids, is_deleted: false, given_date: nil).where('defer_date <= ? OR defer_date IS NULL', Date.today)
        im_types = PatientForecastImmunization.pluck(:vaccine_type)&.uniq&.sort
        patient_lists = current_user.patient_lists.pluck(:name)
        
        if params[:im_types].present?
            forecast = forecast.where(vaccine_type: params[:im_types])
        end

        if params[:last_name].present?
            forecast = forecast.joins(:user).where("users.last_name ILIKE ?", "%#{params[:last_name]}%")
        end

        if params[:patient_list].present?
            patient_list_user_ids = PatientList.find_by(name: params[:patient_list]).patients.pluck(:id)
            forecast = forecast.joins(:user).where(users: { id: patient_list_user_ids })
        end
          
        if params[:dob].present?
            forecast = forecast.joins(:user).where("DATE(users.date_of_birth) = ?", "#{params[:dob]}")
        end

        if params[:due_date_from].present?
            forecast = forecast.where("DATE(minimum_valid_date) >= ?", "#{params[:due_date_from]}")
        end

        if params[:due_date_through].present?
            forecast = forecast.where("DATE(minimum_valid_date) <= ?", "#{params[:due_date_through]}")
        end
        render json: Result.new({data: forecast.as_json(include: :user), im_types: im_types, patient_lists: patient_lists}, "Forecast fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ImmunizationsController#index")
        render json: Result.new(nil, "Forecast cannot be fetched", false), status: 500
    end

    def update
        patient_ids = current_user.get_patients.ids
        forecast = PatientForecastImmunization.where(user_id: patient_ids, id: params[:id]).first
        forecast.update(permit_params.merge(provider_id: current_user.id))
        
        render json: Result.new(forecast, "Immunization is updated", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ImmunizationsController#update")
        render json: Result.new(nil, "Immunization is not updated", false), status: 500
    end

    def patient_immunizations
        patient_ids = current_user.get_patients.ids
        patient_id = params[:patient_id]

        if patient_ids.include?(patient_id&.to_i)
            historic_record = PatientHistoricalImmunization.where(user_id: patient_id).order(immunization_date: :desc)
            forecast_record = PatientForecastImmunization.where(user_id: patient_id).where(is_deleted: false)
            patient = User.find(patient_id)
            render json: Result.new({historic: historic_record, forecast: forecast_record, ndiis_linked: patient.patient_ndiis_account.present?}, "Immunization record fetched", true), status: 200
        else
           render json: Result.new(nil, "No authorization", false), status: 404 
        end
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ImmunizationsController#patient_immunizations")
        render json: Result.new(nil, "Immunization record cannot be fetched", false), status: 500
    end

    def link_to_ndiis
        patient_ids = current_user.get_patients.ids
        patient_id = params[:patient_id]

        if patient_ids.include?(patient_id&.to_i)
            ProcessNdiisLink.new({user_id: patient_id}).call
            patient = User.find(patient_id)
            is_linked = patient.patient_ndiis_account.present?
            if is_linked
                ProcessNdiisData.new({user_id: patient.id}).call
            end
            render json: Result.new({ndiis_linked: is_linked}, "Attempted to link to NDIIS", true), status: 200
        else
           render json: Result.new(nil, "You do not have access to view this page", false), status: 200 
        end
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ImmunizationsController#link_to_ndiis")
        render json: Result.new(nil, "Immunization record cannot be fetched", false), status: 500
    end

    private

    def permit_params
        params.require(:patient_forecast_immunization).permit(:defer_date, :given_date)
    end
end