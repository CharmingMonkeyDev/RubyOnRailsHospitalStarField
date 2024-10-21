# frozen_string_literal: true
class Admin::Reports::AdtDischargeController < ApplicationController
    def action_panel_data
        result = get_data

        render json: Result.new(result, "Provider actions data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Admin::Reports::AdtDischargeController::action_panel_data")
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end

    def assets
        customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        customer_ids = customers.ids
        providers =  User.joins(:customer_users).where.not(role: "patient").where("customer_users.customer_id IN (?)", customer_ids) 
        result = {
            providers: providers,
            customers: customers,
            actions: AssignedPathwayWeekAction&.statuses&.values&.sort,
            patient_classes: AdtPatientNotification&.patient_class_options&.values&.sort,
        }

        render json: Result.new(result, "Provider actions data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Admin::Reports::AdtDischargeController::assets")
        log_errors(e)
        render json: Result.new(nil, e.message, false), status: 500
    end 

    def action_panel_csv_export
        @data = get_data
        respond_to do |format|
          format.csv do
              response.headers["Content-Type"] = "text/csv"
              response.headers["Content-Disposition"] = "attachment; filename=adt_discharge_report_#{Date.today}.csv"
              render template: "admin/reports/adt_discharge_report.csv.erb", content_type: "text/csv"
          end
        end
    end

    private
    def get_data
        # filters are customer, provider, patientclass, and action status
        customer_id = params[:customer_id]
        start_date = params[:start_date]  #Date format "Fri Dec 16 2022 15:36:39 GMT-0600 (Central Standard Time)"
        end_date = params[:end_date]
        provider_id = params[:provider_id]
        patient_class = params[:patient_class]
        action_status = params[:action_status]
        customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        customer_ids = customers.ids

        return AdtDischarge.new({
            start_date: start_date,
            end_date: end_date,
            customer_id: customer_id,
            provider_id: provider_id,
            patient_class: patient_class,
            action_status: action_status,
            customer_ids: customer_ids

        }).get_data
    end
end
