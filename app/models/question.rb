class Question < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :questionnaire
  has_many :options, dependent: :destroy

  accepts_nested_attributes_for :options, allow_destroy: true

  validates_presence_of :title

  enum question_type: {
    multiple_choice: 'multiple_choice',
    true_false: 'true_false',
    short_answer: 'short_answer',
    signature_capture: 'signature_capture',
    consent_capture: 'consent_capture'
  }

  def serializable_hash(ops = nil)
    super(ops).merge(
      options: options,
      type: self.question_type,
    )
  end
end