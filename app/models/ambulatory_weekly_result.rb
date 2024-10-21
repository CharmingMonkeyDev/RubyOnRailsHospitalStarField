# 1 week of ambulatory glucose monitoring data ending on "end_date"
class AmbulatoryWeeklyResult < ApplicationRecord
  belongs_to :user
  validates :data_type, inclusion: { in: %w(average overlay),
    message: "%{value} is not a valid data_type for AmbulatoryWeeklyResult" }
  validates :results, presence: true
end
