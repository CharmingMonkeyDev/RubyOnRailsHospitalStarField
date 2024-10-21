class Questionnaire < ApplicationRecord
  belongs_to :user
  belongs_to :customer
  has_many :questionnaire_assignments, dependent: :destroy
  has_many :questionnaire_resources, dependent: :destroy
  has_many :resource_items, through: :questionnaire_resources
  belongs_to :resource_item, optional: true
  belongs_to :questionnaire_category, optional: true
  has_many :questions, dependent: :destroy
  accepts_nested_attributes_for :questions, allow_destroy: true
  
  enum status: {
    "draft": "draft",
    "published": "published",
    "archived": "archived"
  }

  scope :display_on_tablet, -> { where(display_on_tablet: true) }

  # call backs
  before_save :update_published_at

  def serializable_hash(options = nil)
    super(options).merge(
      resource_item_ids: get_resource_item_ids,
      resource_items: resource_items,
      questions: questions,
      questionnaire_category: questionnaire_category
    )
  end

  private

  def update_published_at
    if self.status == "published" && self.published_at == nil
      self.published_at = Time.now
    end
  end

  def get_resource_item_ids
    self.questionnaire_resources.pluck(:resource_item_id)
  end
end
