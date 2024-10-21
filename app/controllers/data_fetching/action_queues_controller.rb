# frozen_string_literal: true
class DataFetching::ActionQueuesController < ApplicationController
    include JsonHelper

    before_action :set_date_range, only: [:global_action_queues, :global_action_filter_options]

    def global_action_queues
        current_customer = current_user.customer_selection.customer
        company_action_setting = current_customer.company_action_setting

        # Calculate past_days and future_days based on company settings or start/end date params
        past_days = company_action_setting ? company_action_setting.global_action_past_days : 0
        future_days = company_action_setting ? company_action_setting.global_action_future_days : 0
        today = Time.zone.now.beginning_of_day
        
        # Pagination setup
        page = params[:page].to_i || 1
        page = page < 1 ? 1 : page
        per_page = 30
        offset = (page - 1) * per_page

        action_type = params[:action_type]
        providers = params[:providers]
        advanced_categories = params[:advanced_categories]&.split(',')
        query_conditions = []

        case action_type
        when 'My Actions'
            action_type_condition = "action_queues.assigned_to_id = #{current_user.id}"
        when "Unassigned Actions"
            action_type_condition = "action_queues.assigned_to_id IS NULL"
        when "Assigned Actions"
            action_type_condition = "action_queues.assigned_to_id IS NOT NULL"
        when "Overdue Actions"
            action_type_condition = "action_queues.due_date < \'#{Date.today.strftime("%Y-%m-%d")}\'"
        else
            action_type_condition = "customers.id = #{current_customer.id}"
        end

        if providers.present?
            providers_array = providers.split(',').map(&:strip)
            providers_placeholder = providers_array.map { |provider| "\'#{provider}\'" }.join(', ')
            query_conditions << "actions.title IN (#{providers_placeholder}) AND action_queues.assigned_to_id IS NOT NULL"
        end
        
        category_mapping = {
            "Questionnaire Submissions" => 2,
            "ADT Notifications" => 3
        }
        
        mapped_categories = advanced_categories.map { |cat| category_mapping[cat] }.compact

        if advanced_categories.present?
            categories_placeholder = mapped_categories.map { |cat| "#{cat}" }.join(', ')
            puts categories_placeholder
            query_conditions << "actions.action_type IN (#{categories_placeholder})"
        end
        if query_conditions.present?
            final_conditions = query_conditions.join(" OR ")
            final_sql_condition = "(#{final_conditions}) AND #{action_type_condition}"
        else
            final_sql_condition = action_type_condition
        end

        # Fetch overdue actions (due_date < today and status incomplete)
        overdue_aqs = ActionQueue.joins(action: :customer)
                                .where("customers.id = ?", current_customer.id)
                                .where("due_date < ? AND action_queues.status = 'incomplete'", today)
                                
        # Fetch actions based on the determined date range (start_date to end_date)
        filtered_aqs = ActionQueue.joins(action: :customer)
                                        .where("customers.id = ?", current_customer.id)
                                        # .where("action_queues.status != 'incomplete'")
                                        .where("due_date >= ? AND due_date <= ?", @start_date, @end_date)
                                        .where(final_sql_condition)

        # Combine overdue actions and date filtered actions
        # aqs = overdue_aqs.or(filtered_aqs)
        aqs = filtered_aqs
        # Ordering the action queues
        aqs = aqs.order(
          Arel.sql("(CASE WHEN due_date < '#{today}' AND action_queues.status = 'incomplete' THEN 1 " +
                   "WHEN due_date < '#{today}' AND due_date >= '#{today - past_days.days}' THEN 2 " +
                   "WHEN due_date >= '#{today}' THEN 3 END), due_date ASC")
        ).order(:due_date).offset(offset).limit(per_page)

        # Format the data for rendering
        formatted_data = aqs.group_by(&:due_date).map do |due_date, aqs_on_due_date|
          {
            due_date: due_date,
            action_data: aqs_on_due_date.map do |aq|
              {
                action_queue_id: aq.id,
                action_id: aq.action_id,
                status: aq.status,
                action_title: aq.action.title,
                action_subject: aq.action.subject,
                patient_id: aq.patient_id,
                assigned_to_id: aq.assigned_to_id,
                patient_first_name: aq.patient.first_name,
                patient_last_name: aq.patient.last_name,
                patient_middle_name: aq.patient.middle_name,
                provider_first_name: aq.provider&.first_name,
                provider_last_name: aq.provider&.last_name,
                provider_middle_name: aq.provider&.middle_name,
                action_steps: aq.action.action_steps,
                action_resources: aq.action.resources,
                readable_recurrence: aq.get_readable_recurrence,
              }
            end
          }
        end

        total_count_result = formatted_data.count
        has_more = (offset + per_page) < total_count_result
        puts has_more
        # Render the result
        data = {
          data: formatted_data,
          pagination: {
            total_count: total_count_result,
            has_more: has_more,
          }
        }

        render json: Result.new(data, "Global Action Data Retrieved", true), status: 200
      rescue StandardError => e
        Rollbar.warning("Error on fetching global action data#{e} ----DataFetching::ActionQueuesController::global_action_queues")
        json_response(e, 500)
    end

    def get_incompleted_actions
        current_customer = current_user.customer_selection.customer
        company_action_setting = current_customer.company_action_setting
        today = Time.zone.now.beginning_of_day

        patient_id = params[:patient_id]

        page = params[:page].to_i || 1
        page = page < 1 ? 1 : page
        per_page = 30
        offset = (page - 1) * per_page

        puts patient_id
        
        # Fetch actions based on the determined date range (start_date to end_date)
        filtered_aqs = ActionQueue.joins(action: :customer)
                                        .where("action_queues.status = 'incomplete'")
                                        .where("patient_id = ?", patient_id)
 
        # Combine overdue actions and date filtered actions
        # aqs = overdue_aqs.or(filtered_aqs)
        aqs = filtered_aqs
        # Ordering the action queues
        aqs = aqs.order(
          Arel.sql("(CASE WHEN due_date < '#{today}' AND action_queues.status = 'incomplete' THEN 1 " +
                   "WHEN due_date < '#{today}' AND due_date >= '#{today}' THEN 2 " +
                   "WHEN due_date >= '#{today}' THEN 3 END), due_date ASC")
        ).order(:due_date).offset(offset).limit(per_page)

        # Format the data for rendering
        formatted_data = aqs.group_by(&:due_date).map do |due_date, aqs_on_due_date|
          {
            due_date: due_date,
            action_data: aqs_on_due_date.map do |aq|
              {
                action_queue_id: aq.id,
                action_id: aq.action_id,
                status: aq.status,
                action_title: aq.action.title,
                action_subject: aq.action.subject,
                patient_id: aq.patient_id,
                assigned_to_id: aq.assigned_to_id,
                patient_first_name: aq.patient.first_name,
                patient_last_name: aq.patient.last_name,
                patient_middle_name: aq.patient.middle_name,
                provider_first_name: aq.provider&.first_name,
                provider_last_name: aq.provider&.last_name,
                provider_middle_name: aq.provider&.middle_name,
                action_steps: aq.action.action_steps,
                action_resources: aq.action.resources,
                readable_recurrence: aq.get_readable_recurrence,
              }
            end
          }
        end

        total_count_result = formatted_data.count
        has_more = (offset + per_page) < total_count_result
        puts has_more
        # Render the result
        data = {
          data: formatted_data,
          pagination: {
            total_count: total_count_result,
            has_more: has_more,
          }
        }

        render json: Result.new(data, "Patient Action Data Retrieved", true), status: 200
      rescue StandardError => e
        Rollbar.warning("Error on fetching global action data#{e} ----DataFetching::ActionQueuesController::get_incompleted_actions")
        json_response(e, 500)
    end

    def global_action_filter_options
        current_customer = current_user.customer_selection.customer
        company_action_setting = current_customer.company_action_setting
        current_customer_id = current_customer.id

        action_counts = ActionQueue.joins(:action)
                            .where(
                                    actions: { customer_id: current_user.customer_selection.customer.id },
                                    action_queues: {due_date: @start_date..@end_date}
                            )
                           .select(
                             'COUNT(CASE WHEN action_queues.assigned_to_id IS NULL THEN 1 END) AS unassigned_actions_count',
                             'COUNT(CASE WHEN action_queues.assigned_to_id IS NOT NULL THEN 1 END) AS assigned_actions_count',
                             'COUNT(*) AS all_actions_count',
                             "COUNT(CASE WHEN action_queues.assigned_to_id = #{current_user.id} THEN 1 END) AS my_actions_count",
                             "COUNT(CASE WHEN action_queues.status = \'incomplete\' AND action_queues.due_date < \'#{Date.today.strftime("%Y-%m-%d")}\' THEN 1 END) AS overdue_actions_count",
                             "COUNT(CASE WHEN actions.action_type = 2 THEN 1 END) AS questionnaire_submissions",
                             "COUNT(CASE WHEN actions.action_type = 3 THEN 1 END) AS adt_alerts"
                           )
                           .group(nil) # Grouping by actions.id or any other relevant column

        provider_actions = ActionQueue.joins(:action)
                            .where(
                                action_queues: {due_date: @start_date..@end_date}
                            )
                            .where(actions: { customer_id: current_user.customer_selection.customer.id })
                            .where.not(assigned_to_id: nil)
                            .group('actions.id', 'actions.title')
                            .select('actions.id, COUNT(*) AS counts, actions.title AS title, actions.customer_id')

        data = {
            action_counts: action_counts,
            provider_actions: provider_actions
        }
        log_info("User ID #{current_user&.id} called backend to get the counts of each advanced filter options for AssignedPathway --DataFetching::ActionQueuesController::global_action_filter_options")

        render json: Result.new(data, "Global Action Data Retrieved", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error on fetching global action data#{e} ----DataFetching::ActionQueuesController::global_action_queues")
        log_errors(e)
        json_response(e, 500)
    end

    def action_stats
        selected_customer = current_user.customer_selection.customer
        unassigned_actions = ActionQueue.joins(:action)
                        .where(actions: { customer_id: current_user.customer_selection.customer.id })
                        .where(assigned_to_id: nil)
                        .count

        provider_actions = ActionQueue.joins(:action)
                        .where(actions: { customer_id: current_user.customer_selection.customer.id })
                        .where.not(assigned_to_id: nil)
                        .where(status: :incomplete)
                        .count

        questionnaire_submissions = ActionQueue.joins(:action)
                        .where(actions: { customer_id: current_user.customer_selection.customer.id, action_type: 2 })
                        .where(status: :incomplete)
                        .count

        overdue_actions = ActionQueue.joins(:action)
                        .where(actions: { customer_id: current_user.customer_selection.customer.id })
                        .where(status: :incomplete)
                        .where('due_date < ?', Date.today)
                        .count

        adt_alerts = ActionQueue.joins(:action)
                        .where(actions: { customer_id: current_user.customer_selection.customer.id, action_type: 3 })
                        .where(status: :incomplete)
                        .count
        action_stats = {
            unassigned_actions: unassigned_actions,
            provider_actions: provider_actions,
            adt_alerts: adt_alerts,
            questionnaire_submissions: questionnaire_submissions,
            overdue_actions: overdue_actions,
        }
        render json: Result.new(action_stats, "Action Stats Retrieved", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error on fetching action stats#{e} ----DataFetching::ActionQueuesController::action_stats")
        json_response(e, 500)
    end

    def histories
        current_customer = current_user.customer_selection.customer
        aq = ActionQueue.joins(:action)
                    .where(id: params[:id])
                    .where("actions.customer_id = ?", current_customer.id)
                    .first
        histories = aq&.action_queue_histories.includes(:user)
    render json: Result.new(histories, "Action histories fetched", true), include: [:user], status: 200
    rescue StandardError => e
        Rollbar.warning("Error on fetching action histories#{e} ----DataFetching::ActionQueuesController::get_action_histories")
        json_response(e, 500)
    end

    def get_date_range
        start_of_week = Date.today.beginning_of_week
        end_of_week = Date.today.end_of_week
        if params[:existing_date] != "null" && params[:action_type] != "null"
            existing_date = Date.parse(params[:existing_date])
            if params[:action_type] == "increase"
                next_date = existing_date + 7.days
                start_of_week = next_date.beginning_of_week
                end_of_week = next_date.end_of_week
            elsif params[:action_type] == "decrease"
                next_date = existing_date - 7.days
                start_of_week = next_date.beginning_of_week
                end_of_week = next_date.end_of_week
            end
        end
        current_week = start_of_week == Date.today.beginning_of_week ? true : false
        result = {
            start_of_week: start_of_week,
            end_of_week: end_of_week,
            current_week: current_week,
        }
        log_info("User ID #{current_user&.id} called backend to get dates for AssignedPathway --DataFetching::ActionQueuesController::get_date_range")

        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error on getting date range#{e} ----DataFetching::ActionQueuesController::get_date_range")
        json_response(e, 500)
    end

    def get_initial_queue_data
        statuses = AssignedPathwayWeekAction.statuses
        source_summary = generate_action_summary_by_source

        result = {
            statuses: statuses,
            source_summary: source_summary,
        }
        log_info("User ID #{current_user&.id} called backend to get initial queue data for AssignedPathway --DataFetching::ActionQueuesController::get_initial_queue_data")

        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error on getting initial queue data: #{e} ----DataFetching::ActionQueuesController::get_initial_queue_data")
        json_response(e, 500)
    end


    def get_patients_with_unassigned_actions
        selected_customer = current_user.customer_selection.customer
        start_of_week = params[:start_of_week]
        end_of_week = params[:end_of_week]
        result = UnassignedActionsRepository.new(
            selected_customer: selected_customer,
            start_of_week: start_of_week,
            end_of_week: end_of_week,
            source: params[:source]
        ).result
        log_info("User ID #{current_user&.id} accessed list of patients and unassigned health coach actions associated with customer ID #{selected_customer&.id}-- ActionQueuesController::get_patients_with_unassigned_actions")
        render json: Result.new(result, "Data Retrieved", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error getting patient with unassigned action#{e} --ActionQueuesController::get_patients_with_unassigned_actions")
        render json: Result.new(nil, e, false), status: 500
    end

    def get_provider_list
        selected_customer = current_user.customer_selection.customer
        provider_options = selected_customer.users.active.where.not(role: "patient")
        result = {
            provider_options: provider_options,
            selected_provider: current_user
        }
        log_info("User ID #{current_user&.id} accessed list of providers associated with customer ID #{selected_customer&.id}-- ActionQueuesController::get_provider_list")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error getting getting patient with unassinged action #{e} --ActionQueuesController::get_provider_list")
        json_response(e, 500)
    end

    def get_patients_with_assigned_actions
        selected_customer = current_user.customer_selection.customer
        start_of_week = params[:start_of_week]
        end_of_week = params[:end_of_week]
        result = AssignedActionsRepository.new(
            selected_customer: selected_customer,
            start_of_week: start_of_week,
            end_of_week: end_of_week,
            selected_provider_id: params[:selected_provider_id],
            selected_status: params[:selected_status],
            source: params[:source]
        ).result
        log_info("User ID #{current_user&.id} accessed list of patients and assigned health coach actions associated with customer ID #{selected_customer&.id}-- ActionQueuesController::get_patients_with_assigned_actions")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error getting patient with assigned action#{e} --ActionQueuesController::get_patients_with_assigned_actions")
        json_response(e, 500)
    end

    def update_action_coach
        assigned_pathway_week_actions = AssignedPathwayWeekAction.find(params[:action_ids])
        action_ids = params[:action_ids]
        coach_id = params[:coach_id]
        action_ids.each do |id|
            action = AssignedPathwayWeekAction.find(id)
            action.assigned_coach_id = coach_id
            action.status = "incomplete"
            action.assigned_at = Time.now
            action.save!
        end
        message = params[:action_ids].length > 1 ? "The actions have been assigned." : "The action has been assigned."

        log_info("User ID #{current_user&.id} updated assigned patient coach actions to Coach ID #{coach_id}-- ActionQueuesController::update_action_coach")
        render json: {message: message}, status: 200
    rescue StandardError => e
        Rollbar.warning("Error on updating action coach#{e} -- ActionQueuesController::update_action_coach")
        json_response(e, 500)
    end

    def update_assigned_actions
        assigned_pathway_week_actions = AssignedPathwayWeekAction.find(params[:action_ids])
        action_ids = params[:action_ids]
        message = ""

        action_ids.each do |id|
            action = AssignedPathwayWeekAction.find(id)
            if params[:selected_menu_action] == "complete"
                action.status = "complete"
                action.completed_at = Time.now
            end
            if params[:selected_menu_action] == "incomplete"
                action.status = "incomplete"
                action.completed_at = nil
            end
            if params[:selected_menu_action] == "unassign"
                action.assigned_coach_id = nil
                action.status = "unassigned"
                action.assigned_at = nil
                action.completed_at = nil
            end
            if params[:selected_menu_action] == "dismiss"
                action.completed_at = nil
                action.dismissed_at = Time.now
                action.status = "dismissed"
            end
            if params[:selected_menu_action] == "defer"
                action.deferred_until = params[:deferred_until].presence || nil
                action.deferred_at = Time.now
                action.completed_at = nil
                action.status = "deferred"
            end
            action.save!
        end

        message = "Action has been successfully updated."

        log_info("User ID #{current_user&.id} updated assigned patient coach actions with ids #{action_ids}-- ActionQueuesController::update_assigned_actions")
        render json: {message: message}, status: 200
    rescue StandardError => e
        Rollbar.warning("Error on updating assinged action #{e} -- -- ActionQueuesController::update_assigned_actions")
        json_response(e, 500)
    end
end

private
def set_date_range
    current_customer = current_user.customer_selection.customer
    company_action_setting = current_customer.company_action_setting

    # Calculate past_days and future_days based on company settings or start/end date params
    past_days = company_action_setting ? company_action_setting.global_action_past_days : 0
    future_days = company_action_setting ? company_action_setting.global_action_future_days : 0

    today = Time.zone.now.beginning_of_day

    # Determine start_date and end_date based on input or defaults
    if params[:start_date].present? || params[:end_date].present?
        @start_date = params[:start_date].present? ? Date.parse(params[:start_date]).beginning_of_day : Time.zone.now.beginning_of_day
        @end_date = params[:end_date].present? ? Date.parse(params[:end_date]).end_of_day : Time.zone.now.end_of_day
    elsif company_action_setting.nil?
        # Default to the past 14 days if no company settings and no dates are provided
        @start_date = 14.days.ago.beginning_of_day
        @end_date = today
    else
        # Use company settings if no dates are provided
        past_days = company_action_setting.global_action_past_days || 0
        future_days = company_action_setting.global_action_future_days || 0
        @start_date = today - past_days.days
        @end_date = today + future_days.days
    end
end

private

def generate_action_summary_by_source
    customer = current_user.customer_selection.customer
    patient_ids =  customer.customer_users.active_or_pending.pluck(:user_id).flatten.uniq

    active_actions = AssignedPathwayWeekAction.joins(assigned_pathway_week: :assigned_pathway)
                    .where(status: ['unassigned', 'incomplete'], assigned_coach_id: [nil, current_user.id], "assigned_pathways.user_id": patient_ids)


    adt_discharge = active_actions.where(source: 'adt_discharge')
    adt_discharge_count = adt_discharge.count
    adt_discharge_overdue = adt_discharge.any?(&:overdue?)

    care_plan = active_actions.where(source: 'care_plan')
    care_plan_count = care_plan.count
    care_plan_overdue = care_plan.any?(&:overdue?)

    submission = active_actions.where(source: 'questionnaire_submission')
    submission_count = submission.count
    submission_overdue = submission.any?(&:overdue?)

    immunization_forecast_count = PatientForecastImmunization.includes(:user)
                                        .where(user_id: patient_ids, is_deleted: false, given_date: nil)
                                        .where("DATE(minimum_valid_date) >= ? and DATE(minimum_valid_date) <= ?", "#{Date.today}", "#{Date.today + 1.month}")
                                        .count

    {
      summary: {
        count: adt_discharge_count + care_plan_count,
        overdue: adt_discharge_overdue || care_plan_overdue
      },
      adt_discharge: {
        count: adt_discharge_count,
        overdue: adt_discharge_overdue
      },
      care_plan: {
        count: care_plan_count,
        overdue: care_plan_overdue
      },
      questionnaire_submission: {
        count: submission_count,
        overdue: submission_overdue
      },
      immunization: {
        count: immunization_forecast_count,
      }
    }
end
