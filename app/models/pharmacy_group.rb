# frozen_string_literal: true

class PharmacyGroup < ApplicationRecord
  has_many :users
  has_many :resource_items
  has_many :action_pathways
end
