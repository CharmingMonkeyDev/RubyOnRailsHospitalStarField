class Option < ApplicationRecord
  belongs_to :question

  validates_presence_of :title
end
