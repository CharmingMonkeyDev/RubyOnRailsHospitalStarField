# frozen_string_literal: true

require 'rails_helper'

RSpec.describe WeightReading, type: :model do
  describe 'with data' do
    it 'should create a record' do
      user = User.create!(
        email: 'dev+star_patient_test@codelation.com',
        password: 'STAR_key123', 
        role: 'patient',
        first_name: 'Test',
        middle_name: "Patient", 
        last_name: "lastname 1", 
        date_of_birth: '1985-10-12 17:22:02.800194', 
        address: '1st street', 
        city: 'Fargo', 
        state: 'ND', 
        zip: '58103', 
        mobile_phone_number: '555-555-5561', 
        gender: 'Male', 
        patient_identifier: ENV['TEST_PATIENT_IDENTIFIER'],
        user_creation_type: "invited",
      )
      record = user.weight_readings.create(date_recorded: DateTime.now, reading_value: '250', notes: 'test notes')
      expect(record.save).to be true
    end
  end
end
