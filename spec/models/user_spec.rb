# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  context 'User Creation' do
    describe 'without email' do
      it 'should not create user' do
        expect { User.create! }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe 'without password' do
      it 'should not create user' do
        expect { User.create!(email: 'dev@codelation.com') }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe 'with email and password' do
      it 'should create a user' do
        user = User.create(email: 'dev@codelation.com', password: 'CL_key123', first_name: "Dev", last_name: "User")
        expect(user.save).to be true
      end
    end
  end
end
