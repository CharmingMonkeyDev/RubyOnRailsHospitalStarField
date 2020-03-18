class QuestionnaireSubmission < ApplicationRecord
  belongs_to :questionnaire_assignment
  belongs_to :submitter, foreign_key: "user_id", class_name: "User", optional: true
  has_many :questionnaire_actions, dependent: :destroy
  has_many :answers, dependent: :destroy

  accepts_nested_attributes_for :answers

  has_one_attached :signature

  def serializable_hash(options = nil)
    super(options).merge(
      signature_url: get_attached_signature,
      submitter: submitter,
      answers: answers
    )
  end

  private
  def get_attached_signature
    signature.attached? ? Rails.application.routes.url_helpers.url_for(signature) : nil
  end
end