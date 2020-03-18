# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionPathway, type: :model do
  describe 'with data' do
    it 'should create a record' do
      customer = Customer.create!(name: 'test pharmacy')
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: 'User')
      category = ActionCategory.create!(name: 'Test')
      record = ActionPathway.create!(name: 'Test Pathway', customer_id: customer.id)
      expect(record.save).to be true
    end
  end
end
