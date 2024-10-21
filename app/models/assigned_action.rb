# frozen_string_literal: true

class AssignedAction < ApplicationRecord
  belongs_to :user, optional: true
  has_many :recurring_actions, as: :actionable
  has_many :assigned_action_resources, dependent: :destroy
  
  default_scope { includes(:assigned_action_resources).order('created_at DESC') }

  after_create :check_recurring_action
  before_destroy :remove_recurring_action

  enum creation_type: {
    "user_creation": "user_creation",
    "system_creation": "system_creation",
  }

  def serializable_hash(options = nil)
    super(options).merge(
      resource_links: get_resource_links,
    )
  end

  private

  def check_recurring_action
    if self.recurring && self.creation_type == "user_creation"
      self.recurring_actions.create(
        active: true,
        actionable_id: self.id,
        actionable_type: "AssignedAction"
      )
    end
  end

  def remove_recurring_action
    self.recurring_actions&.destroy_all
  end

  def get_resource_links
    links = []
    assigned_action_resources.each do |resource|
      resource_item = resource.resource_item
      link_url = resource_item.link_url
      if resource_item.resource_type == "pdf" 
        link_url = resource_item.pdf_url
      end
      links << {
        name: resource_item.name,
        link: link_url

      }
    end
    links
  end

end
