require 'csv'
class Admin::Reports::PatientDemographicsController < ApplicationController
  include GeneralHelper
  before_action :verify_customer_selection

  def assets
    insurance_types = PatientInsurance.pluck(:insurance_type).uniq.sort
    im_types = PatientForecastImmunization.pluck(:vaccine_type)&.uniq&.sort
    customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
    all_customers = Customer.all

    result = {
        customers: customers,
        insurance_types: insurance_types,
        im_types: im_types,
        all_customers: all_customers
    }
    render json: Result.new(result, "Provider actions data fetched", true), status: 200
  rescue StandardError => e
      Rollbar.warning("Error: #{e} --Admin::Reports::AdtDischargeController::assets")
      log_errors(e)
      render json: Result.new(nil, e.message, false), status: 500
  end 

    def report_data
      data = get_patient_demographics_data
      render json: Result.new(data, "Patient Demographics data fetched", true), status: 200
    rescue StandardError => e
      Rollbar.warning("Error: #{e} --Admin::Reports::PatientDemographicsController::report_data")
      log_errors(e)
      render json: Result.new(nil, e.message, false), status: 500
    end

    def generate_csv
      @data = get_patient_demographics_data
      respond_to do |format|
          format.csv do
              response.headers["Content-Type"] = "text/csv"
              response.headers["Content-Disposition"] = "attachment; filename=patient_demographics_report_#{Date.today}.csv"
              render template: "admin/reports/patient_demographics_report.csv.erb", content_type: "text/csv"
          end
      end
    end

    private

    def get_patient_demographics_data
      data = PatientDemographicsReportRepository.new({
        provider_id: current_user.id,
        customer_id: (params[:admin_report].present? and params[:admin_report].to_i == 1 and check_privilege("Admin Level Reporting")) ? params[:customer_id] : @selected_customer.customer_id,
        insurance_type: params[:insurance_type],
        linked_to_iis: params[:linked_to_iis],
        linked_to_hie: params[:linked_to_hie],
        admin_report: (params[:admin_report].present? and params[:admin_report].to_i == 1 and check_privilege("Admin Level Reporting")) ? true : false
      }).get_data
      
      return data 
    end

end
