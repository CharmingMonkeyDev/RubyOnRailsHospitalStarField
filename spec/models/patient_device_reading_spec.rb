# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PatientDeviceReading, type: :model do
  it 'should create a record' do
    user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
    device = PatientDevice.create(user_id: user.id, identifier: '99999')
    record = device.patient_device_readings.create(reading_type: 'test_reading_type', reading_value: '999',
                                                   date_recorded: '2021-04-21 12:22:34')
    expect(record.save).to be true
  end
end
