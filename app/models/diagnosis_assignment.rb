class DiagnosisAssignment < ApplicationRecord
    belongs_to :actor, class_name: 'User', foreign_key: 'actor_id'
    belongs_to :user

    def as_json(options = {})
      super(options).merge({
      'actor' => "#{actor&.last_name}, #{actor&.first_name}",
      'diagnosis' => "#{diagnosis_code_value} - #{diagnosis_code_desc}"
      })
    end
end