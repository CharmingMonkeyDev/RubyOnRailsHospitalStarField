class ActionQueue < ApplicationRecord
  acts_as_paranoid

  belongs_to :action
  belongs_to :patient, class_name: "User", foreign_key: "patient_id"
  has_one :customer, through: :action
  belongs_to :provider, class_name: "User", foreign_key: "assigned_to_id", optional: true
  has_many :action_queue_histories, dependent: :destroy
  has_many :action_step_queues

  # after_create :create_action_step_queues

  enum status: {
    "incomplete": "incomplete",
    "complete": "complete",
    "skipped": "skipped"
  }
  # def self.fetch_combined_actions_with_steps(customer_id, past_days, future_days, limit = 30, offset = 0)
  #   query = <<-SQL
  #     WITH actions_combined AS (
  #       SELECT 
  #         aq.due_date,
  #         aq.id AS action_queue_id,
  #         aq.action_id,
  #         aq.patient_id,
  #         aq.assigned_to_id,
  #         aq.status,
  #         actions.title AS action_title,
  #         actions.subject AS action_subject,
  #         MAX(patients.first_name) AS patient_first_name, 
  #         MAX(patients.last_name) AS patient_last_name,
  #         MAX(patients.middle_name) AS patient_middle_name,
  #         MAX(prov.first_name) AS provider_first_name,
  #         MAX(prov.last_name) AS provider_last_name,
  #         MAX(prov.middle_name) AS provider_middle_name,
  #         -- Aggregate associated action_steps into a JSON array
  #         JSON_AGG(
  #           JSON_BUILD_OBJECT(
  #             'action_step_id', action_steps.id,
  #             'step_name', action_steps.title
  #           )
  #         ) AS action_steps_data,
  #         JSON_AGG(
  #           JSON_BUILD_OBJECT(
  #             'resource_id', resource_items.id,
  #             'name', resource_items.name,
  #             'link_url', resource_items.link_url
  #           )
  #         ) AS resources_data,
  #         CASE 
  #           -- Priority 1: Overdue (status = incomplete, due date before today)
  #           WHEN aq.due_date < CURRENT_DATE AND aq.status = 'incomplete' THEN 1
  #           -- Priority 2: Past (within A days before today)
  #           WHEN aq.due_date < CURRENT_DATE AND aq.due_date >= (CURRENT_DATE - INTERVAL '#{past_days} days') THEN 2
  #           -- Priority 3: Future (within B days after today)
  #           WHEN aq.due_date >= CURRENT_DATE AND aq.due_date <= (CURRENT_DATE + INTERVAL '#{future_days} days') THEN 3
  #         END AS priority
  #       FROM action_queues aq
  #       LEFT JOIN users patients ON aq.patient_id = patients.id
  #       JOIN actions ON aq.action_id = actions.id
  #       LEFT JOIN action_steps ON actions.id = action_steps.action_id
  #       LEFT JOIN provider_action_resources ON actions.id = provider_action_resources.action_id
  #       LEFT JOIN resource_items on provider_action_resources.resource_item_id = resource_items.id
  #       LEFT JOIN users prov on aq.assigned_to_id = prov.id
  #       WHERE actions.customer_id = #{customer_id}
  #       GROUP BY aq.due_date, aq.id, actions.id
  #       ORDER BY priority, aq.due_date
  #       LIMIT #{limit} OFFSET #{offset}
  #     )

  #     SELECT 
  #       actions_combined.due_date,
  #       JSON_AGG(
  #         JSON_BUILD_OBJECT(
  #           'action_queue_id', actions_combined.action_queue_id,
  #           'action_id', actions_combined.action_id,
  #           'status', actions_combined.status,
  #           'action_title', actions_combined.action_title,
  #           'action_subject', actions_combined.action_subject,
  #           'patient_id', actions_combined.patient_id,
  #           'assigned_to_id', actions_combined.assigned_to_id,
  #           'patient_first_name', actions_combined.patient_first_name,
  #           'patient_last_name', actions_combined.patient_last_name,
  #           'patient_middle_name', actions_combined.patient_middle_name,
  #           'provider_first_name', actions_combined.provider_first_name,
  #           'provider_last_name', actions_combined.provider_last_name,
  #           'provider_middle_name', actions_combined.provider_middle_name,
  #           'action_steps', actions_combined.action_steps_data,
  #           'action_reources', actions_combined.resources_data
  #         )
  #       ) AS action_data
  #     FROM actions_combined
  #     GROUP BY actions_combined.due_date
  #     ORDER BY MIN(actions_combined.priority), actions_combined.due_date;
  #   SQL

  #   # Additional query to count total records
  #   count_query = <<-SQL
  #     SELECT COUNT(*) AS total_count
  #     FROM action_queues aq
  #     JOIN actions ON aq.action_id = actions.id
  #     WHERE actions.customer_id = #{customer_id}
  #     AND (
  #       aq.due_date >= (CURRENT_DATE - INTERVAL '#{past_days} days') OR
  #       aq.due_date <= (CURRENT_DATE + INTERVAL '#{future_days} days')
  #     )
  #   SQL

  #   # Execute both queries
  #   data_result = ActiveRecord::Base.connection.execute(query)
  #   total_count_result = ActiveRecord::Base.connection.execute(count_query).first['total_count'].to_i

  #   # Calculate if there is more data
  #   has_more = (offset + limit) < total_count_result

  #   # Return the data along with pagination info
  #   {
  #     data: data_result,
  #     pagination: {
  #       total_count: total_count_result,
  #       has_more: has_more,
  #       limit: limit
  #     }
  #   }
  # end

  def get_readable_recurrence
    assigned_program = AssignedProgram.where(id: self.assigned_program_id).first
    action_recurrence = Action.find(self.action_id).get_readable_recurrence
    if assigned_program.present?
      pa = ProgramAction.where(program_id: assigned_program.program_id, action_id: self.action_id).first
      if pa.present?
        return pa.get_readable_recurrence || action_recurrence
      end
    end
    
    return action_recurrence
  end

  # private

  # def create_action_step_queues
  #   action.action_steps.each do |step|
  #     action_step_queues.create(action_step: step, status: :incomplete)
  #   end
  # end
end
