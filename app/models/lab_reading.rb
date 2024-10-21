class LabReading < ApplicationRecord
  validates_presence_of :reading_type, :reading_value, :date_recorded, :user_id

  scope :by_type, ->(reading_type) { where(reading_type: reading_type) }
  scope :latest, ->() { order(created_at: 'desc' ) }
end
