class QuestionnaireCategory < ApplicationRecord
  belongs_to :customer, optional: true
  # has_many :questionnaires, foreign_key: :category, primary_key: :db_name
  scope :default_categories, -> { where(is_default: true) }

  # callbacks
  before_save :get_db_name
  
  def as_json(options = {})
    if icon.present?
      super(options).merge(icon_url: ActionController::Base.helpers.asset_url("category_icons/#{icon}.svg"))
    else
      super(options).merge(icon_url: ActionController::Base.helpers.asset_url("category_icons/heart.svg"))
    end
  end
  
  def icon_filename
    self.display_name&.gsub(/\s+/, '_')&.downcase
  end

  def questionnaires 
    Questionnaire.where(category: db_name)
  end

  def displayable_questionnaires 
    Questionnaire.where(category: db_name).where(display_on_tablet: true)
  end

  private
  
  def get_db_name
    self.db_name = self.display_name&.gsub(/\s+/, '_').gsub(/(.)([A-Z])/,'\1_\2')&.downcase
  end
end
