# frozen_string_literal: true

class CustomerDefaultPrivilege < ApplicationRecord
    belongs_to :customer
    belongs_to :privilege
end