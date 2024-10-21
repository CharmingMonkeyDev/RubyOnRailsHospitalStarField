# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResourceItem, type: :model do
  describe 'with data' do
    it 'should create a record' do
      customer = Customer.create(name: "Cool Customer")
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: 'User')
      record = customer.resource_items.create!(name: 'Test Item', link_url: 'https://www.google.com',
                                            resource_type: 'link')
      expect(record.save).to be true
    end
  end
end
