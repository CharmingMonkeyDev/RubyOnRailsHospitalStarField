# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Customer, type: :model do
  describe 'with name' do
    it 'should create a customer' do
      customer = Customer.create(name: 'Test Customer')
      expect(customer.save).to be true
    end
  end
end
