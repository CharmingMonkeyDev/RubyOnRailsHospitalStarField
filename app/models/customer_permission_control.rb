class CustomerPermissionControl < ApplicationRecord
  belongs_to :customer
  belongs_to :customer_permission

  def serializable_hash(options = nil)
    super(options).merge(
      permission_name: self.customer_permission.name,
    )
  end
end
