class Action < ApplicationRecord
  belongs_to :action_category, optional: true
  belongs_to :customer
  has_one :action_recurrence, dependent: :destroy
  has_many :action_steps, dependent: :destroy
  has_many :provider_action_resources, dependent: :destroy
  has_many :resources, through: :provider_action_resources, :source => :resource_item
  has_many :program_actions, :dependent => :destroy
  has_many :programs, through: :program_actions, :source => :program
  
  validates_presence_of :title

  enum action_type: { patient: 0, provider: 1, questionnaire_submission: 2, adt_alerts: 3 }
  enum status: {
    "draft": "draft",
    "published": "published",
    "archived": "archived"
  }

  def as_json(options = {})
    super(options).merge(icon_url: icon.present? ? ActionController::Base.helpers.asset_url("category_icons/#{icon}.svg") : "")
  end

  def serializable_hash(options = nil)
    super(options).merge(
      resource_item_ids: get_resource_item_ids,
      readable_recurrence: get_readable_recurrence,
      category_name: action_category.name,
      action_steps: action_steps,
      action_resources: resources,
      icon_url: icon.present? ? ActionController::Base.helpers.asset_url("category_icons/#{icon}.svg") : "",
    )
  end

  def get_resource_item_ids
    self.provider_action_resources.pluck(:resource_item_id)
  end

  def get_readable_recurrence
    rec = action_recurrence
    if !rec
      return ""
    end
    if !rec.repeat
      return "Does not Repeat"
    end
    if rec.repeat_unit == "day"
      str = "Repeats every #{rec.repeat_value} #{'day'.pluralize(rec.repeat_value)}"
    else
      str = "Repeats every  #{rec.repeat_value} #{'week'.pluralize(rec.repeat_value)}"
      days_of_week = %w[Monday Tuesday Wednesday Thursday Friday Saturday Sunday]
      days = []

      days_of_week.each do |day|
        if rec.public_send(day.downcase)
          days << day
        end
      end
      unless days.empty?
        str << " on " << days.join(', ')
      end
    end
    
    if rec.end_timing == ActionRecurrence.end_timings["after_n_occurences"]
      return str + " till #{rec.occurences} #{'occurences'.pluralize(rec.occurences)}"
    elsif rec.end_timing == ActionRecurrence.end_timings["after_program_start_date"]
      return str + " till #{rec.end_after_program_start_value} #{rec.end_after_program_start_unit&.pluralize(rec.end_after_program_start_value)} after program start date."
    end

    return str
  end

  def pluralize(word, count)
    count == 1 ? word : "#{word}s"
  end
end