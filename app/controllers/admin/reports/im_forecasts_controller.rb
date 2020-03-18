require 'csv'
class Admin::Reports::ImForecastsController < ApplicationController
    def report_data
        ims = get_im_data
        render json: Result.new(ims, "Provider immunizations data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Admin::Reports::ImForecastsController::report_data")
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end

    def assets
        customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        insurance_types = PatientInsurance.pluck(:insurance_type).uniq.sort
        im_types = PatientForecastImmunization.pluck(:vaccine_type)&.uniq&.sort

        result = {
            customers: customers,
            insurance_types: insurance_types,
            im_types: im_types
        }
        render json: Result.new(result, "Provider actions data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Admin::Reports::AdtDischargeController::assets")
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end 

    def generate_csv
        @ims = get_im_data
        respond_to do |format|
            format.csv do
                response.headers["Content-Type"] = "text/csv"
                response.headers["Content-Disposition"] = "attachment; filename=immunization_report_#{Date.today}.csv"
                render template: "admin/reports/im_forecast_report.csv.erb", content_type: "text/csv"
            end
        end
    end

    private

    def get_im_data
        user = current_user
        customers = user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        customer_ids = customers.ids
        patients =  User.joins(:customer_users).where(role: "patient").where("customer_users.customer_id IN (?)", customer_ids) 
        customer_id = params[:customer_id]
        insurance_type = params[:insurance_type]
        im_type = params[:im_type]
        start_date = params[:start_date].present? ? params[:start_date]&.to_datetime.strftime("%Y-%m-%d") : ""
        end_date = params[:end_date].present? ? params[:end_date]&.to_datetime.strftime("%Y-%m-%d") : ""
        ims = ImReportRepository.new({
            provider_id: user.id,
            customer_id: customer_id,
            insurance_type: insurance_type,
            im_type: im_type,
            start_date: start_date,
            end_date: end_date
        }).get_data
        return ims 
    end

end
