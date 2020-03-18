# frozen_string_literal: true

class AssignedPathway < ApplicationRecord
  belongs_to :user
  belongs_to :action_pathway, optional: true
  has_many :assigned_pathway_weeks, dependent: :destroy
  has_many :assigned_pathway_week_actions, through: :assigned_pathway_weeks
  default_scope { order('created_at DESC') }

  def serializable_hash(options = nil)
    super(options).merge(assigned_pathway_weeks: assigned_pathway_weeks, patient: user.as_json({include: [:assigned_actions]}))
  end
  
  def patient 
    user
  end

end
