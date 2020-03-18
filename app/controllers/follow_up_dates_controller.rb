class FollowUpDatesController < ApplicationController

    def create
        patient = current_user.get_patients.find(permit_params[:user_id])
        follow_up_date = patient.follow_up_date
        new_follow_up_date = FollowUpDate.create(permit_params)
        # removing old follow up date
        if follow_up_date
            follow_up_date.destroy            
        end
        action_pathway = ActionPathway.find_or_create_by(name: "Follow Up", customer_id: current_user.customer_selection.customer.id)
        assigned_pathway = action_pathway.assigned_pathways.create(name: params[:follow_up_date][:title], user_id: params[:follow_up_date][:user_id])
        assigned_pathway_week = assigned_pathway.assigned_pathway_weeks.create(name: params[:follow_up_date][:title], start_date: params[:follow_up_date][:next_date])
        assigned_pathway_week_action = assigned_pathway_week.assigned_pathway_week_actions.create(
            text: params[:follow_up_date][:title],
            subtext: params[:follow_up_date][:description],
            recurring: false,
            source: "care_plan",
            creation_type: "user_creation",
            status: "unassigned",
        )

        log_info("User ID #{current_user&.id} created Follow up Action ID #{assigned_pathway_week_action.id}  -- FollowUpDatesController::create")
        if params[:resource_items].length.positive?
            params[:resource_items].each do |resource|
                resource_item = ResourceItem.find_by_id(resource[:id])
                if resource_item.present?
                    assigned_pathway_week_action.resource_items << resource_item
                end
            end
        end

        render json: Result.new(new_follow_up_date, "Follow up date created", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --FollowUpDatesController#create")
        render json: Result.new(nil, "Follow up is not created", false), status: 500
    end

    private

    def permit_params
       params.require(:follow_up_date).permit(:user_id, :next_date)
    end
end
