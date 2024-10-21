class SyncedAccount < ApplicationRecord
    belongs_to :user
    has_many :glucose_readings, dependent: :delete_all

    validates :user_id, uniqueness: true

    def latest_system_reading_older_than?(max_time)
        latest_reading = glucose_readings.order(system_time: :desc).first
        return false unless latest_reading
        
        # Check if the difference between the current time and reading's system_time is more than max_time (in UTC)
        Time.current - DateTime.parse(latest_reading.system_time.to_s) > max_time
    end
end
