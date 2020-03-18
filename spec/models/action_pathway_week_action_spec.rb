# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionPathwayWeekAction, type: :model do
  describe 'with data' do
    it 'should create a record' do
      customer = Customer.create!(name: 'test customer')
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
      category = ActionCategory.create!(name: 'Test')
      patient_action = PatientAction.create!(text: 'Take a walk	Walk', subtext: 'for 15 minutes', recurring: true, icon: 'hand',
                                             customer_id: customer.id, action_category_id: category.id)
      action_pathway = ActionPathway.create!(name: 'Test Pathway', customer_id: customer.id)
      action_pathway_week = action_pathway.action_pathway_weeks.create!(name: 'Week 1')
      record = action_pathway_week.action_pathway_week_actions.create!(text: "Hey there")
      expect(record.save).to be true
    end
  end
end
