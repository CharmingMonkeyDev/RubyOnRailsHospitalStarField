class ActionStep < ApplicationRecord
  belongs_to :action, optional: true
  has_many :action_step_resources, dependent: :destroy
  has_many :resources, through: :action_step_resources, :source => :resource_item
  has_many :action_step_quick_launches, dependent: :destroy
  has_many :action_step_automations, dependent: :destroy

  validates_presence_of :title

  def as_json(options = {})
    super(options).merge(icon_url: icon_url)
  end

  def serializable_hash(options = nil)
    super(options).merge(
      resource_item_ids: get_resource_item_ids,
      action_step_quick_launches: self.action_step_quick_launches,
      action_step_automations: self.action_step_automations,
      action_step_resources: self.resources,
      icon_url: icon_url,
    )
  end

  def icon_url
    icon.present? ? ActionController::Base.helpers.asset_url("category_icons/#{icon}.svg") : ""
  end

  def get_resource_item_ids
    self.action_step_resources.pluck(:resource_item_id)
  end
end
