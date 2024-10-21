class LtcFacilityAssignment < ApplicationRecord
  belongs_to :user
  belongs_to :actor, class_name: 'User', foreign_key: 'actor_id'
  belongs_to :ltc_facility

  def as_json(options = {})
    super(options).merge({
    'actor' => "#{actor&.last_name}, #{actor&.first_name}",
    'facility_name' => ltc_facility.name
    })
  end
end