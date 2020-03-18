# frozen_string_literal: true

if PatientMedication.count.zero?
  User.where(role: 'patient').each do |user|
    user.patient_medications.create!(name: 'Glargine', value: '20 units bedtime')
    user.patient_medications.create!(name: 'Lisinopril', value: '40mg AM')
    user.patient_medications.create!(name: 'Test BG', value: '3x/day')
  end
end