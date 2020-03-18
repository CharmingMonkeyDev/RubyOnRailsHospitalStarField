# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PatientActionGroupAction, type: :model do
  describe 'with data' do
    it 'should create a record' do
      customer = Customer.create!(name: 'test customer')
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: "dev", last_name: "user")
      category = ActionCategory.create(name: 'Test')
      patient_action = PatientAction.create(text: 'Take a walk	Walk', subtext: 'for 15 minutes', recurring: true,
                                            icon: 'hand', customer_id: customer.id, action_category_id: category.id)
      action_group = PatientActionGroup.create(name: 'Group', icon: 'hand', customer_id: customer.id)
      record = PatientActionGroupAction.create(patient_action_group_id: action_group.id)
      expect(record.save).to be true
    end
  end
end
