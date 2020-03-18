# frozen_string_literal: true

class AssignedPathwayWeek < ApplicationRecord
  belongs_to :assigned_pathway
  has_many :assigned_pathway_week_actions, dependent: :destroy
  default_scope { includes(:assigned_pathway_week_actions).order('assigned_pathway_weeks.start_date ASC') }

  def serializable_hash(options = nil)
    super(options).merge(assigned_pathway_week_actions: assigned_pathway_week_actions)
  end
end
