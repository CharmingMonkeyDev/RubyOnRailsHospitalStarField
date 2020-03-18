class QuestionnaireResource < ApplicationRecord
  belongs_to :questionnaire
  belongs_to :resource_item
end
