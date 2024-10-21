# frozen_string_literal: true

class ActionPathwayWeek < ApplicationRecord
  belongs_to :action_pathway
  has_many :action_pathway_week_actions, dependent: :destroy

  def as_json(options = {})
    options[:include] = %i[action_pathway_week_actions]
    super
  end

  def serializable_hash(options = nil)
    super(options).merge(action_pathway_week_actions: action_pathway_week_actions)
  end
end
