class Program < ApplicationRecord
  belongs_to :customer

  has_many :program_actions, :dependent => :destroy
  has_many :actions, -> { order('LOWER(title)') }, through: :program_actions, :source => :action

  has_many :assigned_programs, dependent: :destroy
  has_many :patients, through: :assigned_programs, source: :patient
  
  validates_presence_of :title

  enum status: {
    "draft": "draft",
    "published": "published",
    "archived": "archived"
  }

  def serializable_hash(options = nil)
    super(options).merge(
      action_ids: get_action_ids,
    )
  end

  def get_action_ids
    self.program_actions.pluck(:action_id)
  end
end
