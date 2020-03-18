# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ChatChannel, type: :model do
  describe 'with data' do
    it 'should create a record' do
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
      record = user.chat_channels.create(name: 'Test Data')
      expect(record.save).to be true
    end
  end
end
