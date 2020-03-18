# frozen_string_literal: true

class PatientMedication < ApplicationRecord
  belongs_to :user
  default_scope { order('created_at DESC') }

  def serializable_hash(options = nil)
    super(options).merge(
      formatted_created_at: formatted_created_at, 
    )
  end

  private
  

  def formatted_created_at
    self.created_at&.strftime("%m/%d/%Y")
  end

end
