# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AssignedPathwayWeekAction, type: :model do
  describe 'with data' do
    it 'should create a record' do
      customer = Customer.create!(name: 'test customer')
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
      category = ActionCategory.create!(name: 'Test')
      action_pathway = ActionPathway.create!(name: 'Test Pathway', customer_id: customer.id)
      patient_action = PatientAction.create!(text: 'Take a walk	Walk', subtext: 'for 15 minutes', recurring: true, icon: 'hand', customer_id: customer.id, action_category_id: category.id)
      assigned_pathway = user.assigned_pathways.create!(user_id: user.id, name: 'Test Assigned Pathway')
      assigned_pathway_week = assigned_pathway.assigned_pathway_weeks.create!(name: 'Week 1')
      record = assigned_pathway_week.assigned_pathway_week_actions.create!(assigned_pathway_week_id: assigned_pathway_week.id, text: 'Take a walk	Walk', assigned_at: Time.now, subtext: 'for 15 minutes', recurring: true)
      expect(record.save).to be true
    end
  end
end
