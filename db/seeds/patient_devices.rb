# frozen_string_literal: true

if PatientDevice.count.zero?
  User.where(role: 'patient').each do |user|
    PatientDevice.create!(identifier: ENV['TEST_DEVICE_IDENTIFIER'], user_id: user.id)
  end
end
