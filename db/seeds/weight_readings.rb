# frozen_string_literal: true

if WeightReading.count.zero?
  User.where(role: 'patient').each do |user|
    user.weight_readings.create!(reading_value: '250', date_recorded: DateTime.now)
    user.weight_readings.create!(reading_value: '150', date_recorded: DateTime.now)
    user.weight_readings.create!(reading_value: '350', date_recorded: DateTime.now)
  end
end
