# frozen_string_literal: true

if PatientActionGroup.count.zero?
  customer_id = Customer.first.id

  group = PatientActionGroup.create!(customer_id: customer_id, name: 'Smoking Cessation', icon: 'hand')
  group.patient_action_group_actions.create!(patient_action_id: 1)
  group.patient_action_group_actions.create!(patient_action_id: 2)
  group.patient_action_group_actions.create!(patient_action_id: 3)

  group = PatientActionGroup.create!(customer_id: customer_id, name: 'Diabetes Protocol', icon: 'hospital')
  group.patient_action_group_actions.create!(patient_action_id: 4)
  group.patient_action_group_actions.create!(patient_action_id: 5)
  group.patient_action_group_actions.create!(patient_action_id: 6)
end
