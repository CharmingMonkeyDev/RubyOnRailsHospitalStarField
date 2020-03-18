# frozen_string_literal: true

class ActionPathway < ApplicationRecord
  belongs_to :customer
  default_scope { includes(:action_pathway_weeks).order('created_at DESC') }

  has_many :action_pathway_weeks, dependent: :destroy
  has_many :assigned_pathways
  
  def as_json(options = {})
    options[:include] = %i[action_pathway_weeks]
    super
  end
end
