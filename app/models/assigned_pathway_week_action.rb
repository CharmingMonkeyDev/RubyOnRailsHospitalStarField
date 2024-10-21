# frozen_string_literal: true

class AssignedPathwayWeekAction < ApplicationRecord
  include DateHelper
  belongs_to :assigned_pathway_week
  has_one :adt_provider_action
  has_one :adt_patient_notification, through: :adt_provider_action
  belongs_to :provider, class_name: "User", foreign_key: "assigned_coach_id", optional: true
  has_many :recurring_actions, as: :actionable
  has_and_belongs_to_many :resource_items
  
  # callbacks
  after_create :check_recurring_action
  before_destroy :remove_recurring_action

  default_scope { order('created_at DESC') }

  attr_accessor :due_date

  enum status: {
    unassigned: "unassigned",
    incomplete: "incomplete",
    complete: "complete",
    deferred: "deferred",
    dismissed: "dismissed",
  }

  enum creation_type: {
    "user_creation": "user_creation",
    "system_creation": "system_creation",
  }

  def serializable_hash(options = nil)
    super(options).merge(
      provider_name: get_coach_name
    )
  end
  
  def action_pathway 
    self.assigned_pathway_week.assigned_pathway.action_pathway
  end 

  def overdue?
    due_date < Date.today
  end

  def due_date
    #If an action from a care plan
    if source == "care_plan" || source == "questionnaire_submission"
      last_day_of_week(self.assigned_pathway_week.start_date)
    elsif source == "adt_discharge"
      #If an ADT action
      self.assigned_pathway_week.start_date + 4.days
    end
  end

  def as_json(options={})
    super(options.merge(methods: [:due_date]))
  end


  private

  def check_recurring_action
    if self.recurring && self.creation_type == "user_creation" 
      self.recurring_actions.create(
        active: true,
        actionable_id: self.id,
        actionable_type: "AssignedPathwayWeekAction"
      )
    end
  end

  def remove_recurring_action
    self.recurring_actions&.destroy_all
  end

  def get_coach_name
    self.provider&.name_reversed
  end
end
