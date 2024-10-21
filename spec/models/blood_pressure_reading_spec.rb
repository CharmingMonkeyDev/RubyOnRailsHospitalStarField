# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BloodPressureReading, type: :model do
  it 'should create a record' do
    user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
    record = user.blood_pressure_readings.create(date_recorded: DateTime.now, systolic_value: '120',
                                                 diastolic_value: '80', notes: 'test notes')
    expect(record.save).to be true
  end
end
