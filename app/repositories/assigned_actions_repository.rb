class AssignedActionsRepository

    attr_reader :result
  
    def initialize(attributes={})
      @selected_customer = attributes[:selected_customer]
      @start_of_week = attributes[:start_of_week]
      @end_of_week = attributes[:end_of_week]
      @selected_provider_id = attributes[:selected_provider_id]
      @selected_status = attributes[:selected_status] || ""
      @source = attributes[:source] || "all"
    end

    def result
      @result ||= build_assigned_action_queue_data
    end

    private

    attr_reader :selected_customer, :selected_provider_id, :selected_status, :start_of_week, :end_of_week

    def is_selected_action_status?(action)
        action.status == selected_status || (selected_status == "" && action.status != "complete" && action.status != "deferred" && action.status != "dismissed")
    end

    def build_assigned_action_queue_data
        #Used as the list of acceptable coaches an action can be assigned to
        coach_options = selected_customer.users.where.not(role: "patient")

        provider = selected_provider_id != "undefined" ? User.find(selected_provider_id) : coach_options.first
        actions = provider
            .provider_assigned_pathway_week_actions
        if start_of_week.present? && end_of_week.present?
            actions = actions.joins("
                join assigned_pathway_weeks on assigned_pathway_week_actions.assigned_pathway_week_id = assigned_pathway_weeks.id
                and DATE(assigned_pathway_weeks.start_date) >= :start_of_week
                and DATE(assigned_pathway_weeks.start_date) <= :end_of_week
            ", start_of_week: start_of_week, end_of_week: end_of_week)
        else
            actions = actions.joins("
                join assigned_pathway_weeks on assigned_pathway_week_actions.assigned_pathway_week_id = assigned_pathway_weeks.id
            ")
        end

        patients_array = []
        actions.each do |action|
            user_id = action.assigned_pathway_week.assigned_pathway.user.id
            patient = patients_array.select{|patient| patient["id"] == user_id}.first

            # byebug
            action.due_date = action&.due_date.presence || nil


            # Filter by source
            if @source != "" && @source != "all"
                next if action.source != @source
            end

            if patient
                if is_selected_action_status?(action)
                    patient["assigned_actions"] << action
                end
            else
                customer_user = CustomerUser.where(user_id: user_id).where(customer_id: selected_customer.id).first
                if customer_user
                    patient = {}

                    patient["assigned_actions"] = []
                    if is_selected_action_status?(action)
                        patient["assigned_actions"] << action
                    end

                    patient["id"] = action.assigned_pathway_week.assigned_pathway.user.id
                    patient["first_name"] = action.assigned_pathway_week.assigned_pathway.user.first_name
                    patient["middle_name"] = action.assigned_pathway_week.assigned_pathway.user.middle_name
                    patient["last_name"] = action.assigned_pathway_week.assigned_pathway.user.last_name
                    patient["expanded"] = false
                    patients_array << patient
                end
            end
        end

        scoped_patients = patients_array.select{|m| m["assigned_actions"].length > 0}

        result = {
            patients: scoped_patients,
        }
        result
    end
end