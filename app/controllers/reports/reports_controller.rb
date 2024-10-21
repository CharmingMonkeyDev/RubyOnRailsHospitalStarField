class Reports::ReportsController < ApplicationController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?

  def navigation_data
        patient = User.find(params[:patient_id])
        assigned_questionnaire_ids = patient.questionnaire_assignments.pluck(:questionnaire_id)
        active_nav = Questionnaire.where(id: assigned_questionnaire_ids).pluck(:category)
        result = {
            health_overview_icon: ActionController::Base.helpers.asset_url('patient_reports_icon.png'),
            health_overview_white_icon: ActionController::Base.helpers.asset_url('patient_reports_white_icon.png'),
            cgm_icon: ActionController::Base.helpers.asset_url('cgm_icon.svg'),
            cgm_data_1: "NED",
            cgm_data_2: "NED",
            active_nav: active_nav
        }
        render json: Result.new(result, "Navigation Data fetched", true), status: 200
    rescue ActiveRecord::RecordNotFound
        render json: Result.new(nil, "Patient not found", false), status: :not_found
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::ReportsController::navigation_data")
        render json: Result.new(nil, e.message, false), status: 500
    end
    
    def provider_actions_data
      result = get_provider_actions_data
      render json: Result.new(result, "Provider actions data fetched", true), status: 200
    rescue StandardError => e
      Rollbar.warning("Error: #{e} --Reports::ReportsController::provider_actions_data")
      log_errors(e)
      render json: Result.new(nil, e.message, false), status: 500
    end 

    def provider_actions_csv_export
      @data = get_provider_actions_data

      respond_to do |format|
          format.csv do
              response.headers["Content-Type"] = "text/csv"
              response.headers["Content-Disposition"] = "attachment; filename=provider_actions_report_#{Date.today}.csv"
              render template: "admin/reports/provider_actions_report.csv.erb", content_type: "text/csv"
          end
      end
    end

    private
    def get_provider_actions_data
      customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
      customer_ids = customers.ids
      providers =  User.joins(:customer_users).where.not(role: "patient").where("customer_users.customer_id IN (?) and customer_users.status = 'accepted'", customer_ids) 
      if params[:provider_id].present?
        providers = User.where(id: params[:provider_id])
      end     

      if params[:customer_id].present? 
        @selected_customer = Customer.find_by_id(params[:customer_id])
      else
        @selected_customer = Customer.find_by_id(customer_ids.first)
      end           

      assigned_actions = AssignedPathwayWeekAction.where(assigned_coach_id: providers.ids).includes(assigned_pathway_week: [assigned_pathway: [:action_pathway]]).includes(:provider)
      if assigned_actions && params[:assignment_date_start].present?
        assigned_actions = assigned_actions.where("assigned_at >= ? and assigned_at <= ?",DateTime.strptime(params[:assignment_date_start], "%m/%d/%Y")&.to_date&.beginning_of_day, DateTime.strptime(params[:assignment_date_end], "%m/%d/%Y")&.to_date&.end_of_day)
      else 
        assigned_actions = assigned_actions.where(assigned_at: Time.now-14.days..Time.now)
      end
      if params[:action_status].present? 
        if params[:action_status] == "incomplete"
          assigned_actions = assigned_actions.where(completed_at: nil)
        else
          assigned_actions = assigned_actions.where.not(completed_at: nil)
        end
      end  
      actions_json = assigned_actions.map do |assigned_action| 
          if assigned_action.action_pathway 
            customer = assigned_action.action_pathway.customer.name
          else 
            customer = (assigned_action.assigned_pathway_week.assigned_pathway.user.customers.map{|c| c.name}).join(", ")
          end 
          if @selected_customer.present? 
            next unless customer.include? @selected_customer.name
          end  
          assigned_action.attributes.merge({provider: assigned_action.provider, patient: assigned_action.assigned_pathway_week.assigned_pathway.patient, customer: customer})
      end.compact
      
      customers = current_user.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
      customer_ids = customers.ids
      providers =  User.joins(:customer_users).where.not(role: "patient").where("customer_users.customer_id IN (?)", customer_ids) 
      data = {
        providers: providers,
        customers: customers,
        actions: actions_json,
        incomplete_actions: assigned_actions.select{|action| action.completed_at.nil?}.count,
        completed_actions: assigned_actions.select{|action| action.completed_at.present?}.count,
      }

      return data
    end
end
