# frozen_string_literal: true

class CustomerUserPrivilege < ApplicationRecord
    belongs_to :customer_user
    belongs_to :privilege
end
