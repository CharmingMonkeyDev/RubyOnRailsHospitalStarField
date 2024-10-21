class Answer < ApplicationRecord
  belongs_to :questionnaire_submission
  belongs_to :question
  has_many :multiple_choice_answers

  accepts_nested_attributes_for :multiple_choice_answers

  def serializable_hash(options = nil)
    super(options).merge(
      answer: render_answer
    )
  end

  private
  def render_answer
    if question.multiple_choice? || question.true_false?
      multiple_choice_answers.map { |ans| ans.option.title }.join(", ")
    elsif question.consent_capture?
      (accepted ? "Accepted" : "Not Accepted") + ' - ' + answer_text
    else
      answer_text
    end
  end
end