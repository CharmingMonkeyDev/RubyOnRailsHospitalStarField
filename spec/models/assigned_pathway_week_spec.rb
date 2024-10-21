# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AssignedPathwayWeek, type: :model do
  describe 'with data' do
    it 'should create a record' do
      customer = Customer.create!(name: 'test customer')
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
      category = ActionCategory.create!(name: 'Test')
      action_pathway = ActionPathway.create!(name: 'Test Pathway', customer_id: customer.id)
      assigned_pathway = user.assigned_pathways.create!(user_id: user.id,
                                                        name: 'Test Assigned Pathway')
      record = assigned_pathway.assigned_pathway_weeks.create!(name: 'Week 1')
      expect(record.save).to be true
    end
  end
end
