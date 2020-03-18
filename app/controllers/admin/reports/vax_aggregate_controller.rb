require 'csv'
class Admin::Reports::VaxAggregateController < ApplicationController
  include GeneralHelper
  before_action :verify_customer_selection

  def assets
    insurance_types = PatientInsurance.pluck(:insurance_type).uniq.sort
    customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
    all_customers = Customer.all
    im_types = PatientForecastImmunization.pluck(:vaccine_type)&.uniq&.sort

    result = {
        customers: customers,
        insurance_types: insurance_types,
        all_customers: all_customers,
        im_types: im_types
    }

    render json: Result.new(result, "Assets data fetched", true), status: 200
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --Admin::Reports::AdtDischargeController::assets")
    log_errors(e)
    render json: Result.new(nil, e.message, false), status: 500
  end 

  def report_data
    data = get_aggregate_data
    render json: Result.new(data, "Vax aggregate data fetched", true), status: 200
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --Admin::Reports::VaxAggregateController::report_data")
    log_errors(e)
    render json: Result.new(nil, e.message, false), status: 500
  end

  def generate_csv
    @data = get_aggregate_data
    im_types = PatientForecastImmunization.pluck(:vaccine_type)&.uniq&.sort
    @headers = [
      'Customer Name', 
      'Customer ZIP', 
      'Customer County',
    ]
    @fields = [
      "name",
      "zip",
      "county",
    ]
    # Adding headers and fields dynamically
    im_types.each do |type|
      @headers.push("#{type} Forecasted")
      @headers.push("#{type} Given")
      @headers.push("#{type} Deferred")

      @fields.push("#{to_snake_case(type)}_forecasted")
      @fields.push("#{to_snake_case(type)}_given")
      @fields.push("#{to_snake_case(type)}_deferred")
    end
    @headers += ['Total Forecasted',
                  'Total Given',
                  'Total Deferred']
    @fields += ['total_forecasted',
      'total_given',
      'total_deferred']

    respond_to do |format|
      format.csv do
        response.headers["Content-Type"] = "text/csv"
        response.headers["Content-Disposition"] = "attachment; filename=vax_aggregate_report_#{Date.today}.csv"
        render template: "admin/reports/vax_aggregate_report.csv.erb", content_type: "text/csv"
      end
    end
  end

  private

  def get_aggregate_data
    data = VaxAggregateReportRepository.new({
      provider_id: current_user.id,
      customer_id: (params[:admin_report].present? and params[:admin_report].to_i == 1 and check_privilege("Admin Level Reporting")) ? params[:customer_id] : @selected_customer.customer_id,
      insurance_type: params[:insurance_type],
      start_date: (params[:start_date].present? and !params[:start_date].nil? and params[:start_date] != "null") ? params[:start_date]&.to_datetime.strftime("%Y-%m-%d") : "",
      end_date: (params[:end_date].present? and !params[:end_date].nil? and params[:end_date] != "null") ? params[:end_date]&.to_datetime.strftime("%Y-%m-%d") : "",
      admin_report: (params[:admin_report].present? and params[:admin_report].to_i == 1 and check_privilege("Admin Level Reporting")) ? true : false
    }).get_data
    
    return data 
  end

end
