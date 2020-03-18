class UnassignedActionsRepository

    attr_reader :result
  
    def initialize(attributes={})
        @selected_customer = attributes[:selected_customer]
        @start_of_week = attributes[:start_of_week]
        @end_of_week = attributes[:end_of_week]
        @source = attributes[:source] || "all"
    end

    def result
        @result ||= build_unassigned_action_queue_data
    end

    private

    attr_reader :selected_customer, :start_of_week, :end_of_week

    def get_unassigned_coach_actions(patient, end_of_week, start_of_week)
        actions_array = []
        action_ids = User.joins(
            assigned_pathways: {
                assigned_pathway_weeks: [:assigned_pathway_week_actions]
            })
            .where(id: patient.id)
        
        if start_of_week.present? && end_of_week.present?
            action_ids = action_ids.where("date(assigned_pathway_weeks.start_date) >= ?", start_of_week)
                .where("date(assigned_pathway_weeks.start_date) <= ?", end_of_week)
        end

        action_ids = action_ids.where("assigned_pathway_week_actions.status = 'unassigned'")
            .pluck(:'assigned_pathway_week_actions.id')

        actions = AssignedPathwayWeekAction.where(id: action_ids)

        if @source != "" && @source != "all"
            actions = actions.where(source: @source)
        end

        actions.each do |action|
            action_obj = {}
            action_obj["id"] = action.id
            action_obj["text"] = action.text
            action_obj["status"] = action.status
            action_obj["expanded"] = false
            action_obj["due_date"] = action.due_date
            action_obj["source"] = action.source
            actions_array.push(action_obj)
        end
        actions_array
    end

    def build_unassigned_action_queue_data
        #Used as the list of acceptable coaches an action can be assigned to
        coach_options = selected_customer.users.active.where.not(role: "patient").order(:last_name)

        actively_assigned_user_ids =  selected_customer.customer_users.active_or_pending.pluck(:user_id).uniq

        patient_users = User.joins(
            "right join assigned_pathways on 
            users.id = assigned_pathways.user_id 
            right join assigned_pathway_weeks on 
            assigned_pathways.id = assigned_pathway_weeks.assigned_pathway_id 
            right join assigned_pathway_week_actions on 
            assigned_pathway_weeks.id = assigned_pathway_week_actions.assigned_pathway_week_id")
            .where(id: actively_assigned_user_ids, role: 0).order(:last_name).group(:id)
    
        
        patients_array = []
        patient_users.each do |patient|
            patient_obj = {}
            unassigned_actions = get_unassigned_coach_actions(patient, end_of_week, start_of_week)
            patient_obj["id"] = patient.id
            patient_obj["first_name"] = patient.first_name
            patient_obj["last_name"] = patient.last_name
            patient_obj["middle_name"] = patient.middle_name
            patient_obj["unassigned_actions"] = unassigned_actions
            patient_obj["expanded"] = false
            patients_array << patient_obj
        end

        scoped_patients_array = patients_array.select{|m| m["unassigned_actions"].length > 0}

        result = {
            patients: scoped_patients_array,
            start_of_week: start_of_week,
            end_of_week: end_of_week,
            coach_options: coach_options
        }
        return result
    end
end