# frozen_string_literal: true

if BloodPressureReading.count.zero?
  User.where(role: 'patient').each do |user|
    user.blood_pressure_readings.create!(systolic_value: '120', diastolic_value: '80', date_recorded: DateTime.now)
    user.blood_pressure_readings.create!(systolic_value: '129', diastolic_value: '70', date_recorded: DateTime.now)
    user.blood_pressure_readings.create!(systolic_value: '140', diastolic_value: '90', date_recorded: DateTime.now)
  end
end
