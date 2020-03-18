require 'csv'
class Admin::Reports::EncounterDetailController < ApplicationController
    before_action :verify_customer_selection
    def report_data
        ims = get_data
        render json: Result.new(ims, "Encounter detail data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Admin::Reports::EncounterDetailController::report_data")
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end

    def assets
        insurance_types = EncounterInsuranceInformation.where.not(insurance_type: nil).pluck(:insurance_type).uniq.sort
        encounter_types = EncounterBilling.where.not(encounter_type: nil).pluck(:encounter_type).uniq.sort
        insurance_types = EncounterInsuranceInformation.where.not(insurance_type: nil).pluck(:insurance_type).uniq.sort
        billing_codes   = EncounterClaimInformation.where.not(cpt_code: nil).pluck(:cpt_code).uniq.sort
        customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        all_customers = Customer.all

        result = {
            customers: customers,
            insurance_types: insurance_types,
            encounter_types: encounter_types,
            billing_codes: billing_codes,
            all_customers: all_customers,
        }
        render json: Result.new(result, "Encounter detail data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Admin::Reports::EncounterDetailController::assets")
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end 

    def generate_csv
        @data = get_data
        respond_to do |format|
            format.csv do
                response.headers["Content-Type"] = "text/csv"
                response.headers["Content-Disposition"] = "attachment; filename=encounter_detail_report_#{Date.today}.csv"
                render template: "admin/reports/encounter_detail_report.csv.erb", content_type: "text/csv"
            end
        end
    end

    private

    def get_data
        user = current_user
        start_date = (params[:start_date].present? and params[:start_date] != "null") ? params[:start_date]&.to_datetime.strftime("%Y-%m-%d") : ""
        end_date = (params[:end_date].present? and params[:end_date] != "null") ? params[:end_date]&.to_datetime.strftime("%Y-%m-%d") : ""
        data = EncounterDetailReportRepository.new({
            provider_id: current_user.id,
            customer_id: (params[:admin_report].present? and params[:admin_report].to_i == 1 and check_privilege("Admin Level Reporting")) ? params[:customer_id] : @selected_customer.customer_id,
            insurance_type: params[:insurance_type],
            encounter_type: params[:encounter_type],
            billing_code: params[:billing_code],
            start_date: start_date,
            end_date: end_date,
            admin_report: (params[:admin_report].present? and params[:admin_report].to_i == 1 and check_privilege("Admin Level Reporting")) ? true : false
        }).get_encounter_data

        return data 
    end
end
