class ProcessAdtDischargeActionQueue
    def initialize(attributes)
        @attributes = attributes
        @adt_patient_notification_id = attributes[:adt_patient_notification_id]
    end

    def call
        process_inbound_notif
    end

    private

    attr_accessor :adt_patient_notification_id

    def adt_patient_notification
        @adt_patient_notification ||= AdtPatientNotification.find(adt_patient_notification_id)
    end

    def user
        @user ||= adt_patient_notification.user
    end

    def process_inbound_notif
        if user
            pathway = create_assigned_pathway
            pathway_week = create_pathway_week(pathway)
            pathway_week_action = create_pathway_week_action(pathway_week)
        else
            Rollbar.warning("Patient does not exist for ADT Patient notification #{adt_patient_notification_id}")
        end
    end

    def create_action_queue
        related_customers = @user.customers
        related_customers.each do |customer|
            action = Action.where(customer_id: customer.id, action_type: :adt_alerts).first
            if action.present?
                action.update(title: "Patient Discharged")
            else
                action = Action.create!(
                    action_type: :adt_alerts,
                    title: "Patient Discharged",
                    customer_id: customer.id,
                    published_at: Time.now,
                    status: :published,
                    action_category_id: ActionCategory.first.id,
                )
            end
            action_queue = ActionQueue.create!(
                patient_id: user.id,
                action_id: action.id,
                due_date: Date.today,
            )
            
            adt_provider_action = AdtProviderAction.create!(
                action_queue_id: action_queue.id,
                adt_patient_notification_id: adt_patient_notification_id
            )
        end
    end

    # def create_assigned_pathway
    #     pathway = AssignedPathway.create!(
    #         user_id: user.id,
    #         name: "Patient Discharged",
    #         start_date: Date.today,
    #         action_pathway_id: nil
    #     )
    #     pathway
    # end

    # def create_pathway_week(pathway)
    #     pathway_week = AssignedPathwayWeek.create(
    #         assigned_pathway_id: pathway.id,
    #         name: "Patient Discharged",
    #         start_date: Date.today
    #     )
    #     pathway_week
    # end

    # def create_pathway_week_action(pathway_week)
    #     pathway_week_action = AssignedPathwayWeekAction.create(
    #         assigned_pathway_week_id: pathway_week.id,
    #         text: "Patient Discharged",
    #         subtext: "Patient Discharged",
    #         recurring: false,
    #         status: "unassigned",
    #         source: "adt_discharge",
    #     )
    #     create_adt_provider_action(pathway_week_action)
    # end

    # def create_adt_provider_action(pathway_week_action)
    #     adt_provider_action = AdtProviderAction.create(
    #         assigned_pathway_week_action_id: pathway_week_action.id,
    #         adt_patient_notification_id: adt_patient_notification.id
    #     )
    # end
end