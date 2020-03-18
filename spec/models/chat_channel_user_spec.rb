# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ChatChannelUser, type: :model do
  describe 'with data' do
    it 'should create a record' do
      user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: 'Dev', last_name: "User")
      record = user.chat_channels.create(name: 'Test Data')
      record.chat_channel_users.create(user_id: user.id, chat_user: '1-user', user_type: 'user')
      expect(record.save).to be true
    end
  end
end
