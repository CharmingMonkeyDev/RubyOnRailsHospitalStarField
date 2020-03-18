# frozen_string_literal: true

class Privilege < ApplicationRecord
    has_many :customer_user_privileges
    has_many :customer_users, through: :customer_user_privileges
end
  