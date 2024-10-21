class MultipleChoiceAnswer < ApplicationRecord
  belongs_to :answer
  belongs_to :option
end
