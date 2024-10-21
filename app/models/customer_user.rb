class CustomerUser < ApplicationRecord
  belongs_to :user
  belongs_to :customer
  belongs_to :created_by, class_name: "User", foreign_key: "created_by_id", optional: true
  has_many :customer_user_privileges, dependent: :destroy
  has_many :privileges, through: :customer_user_privileges

  scope :active, -> {where(status: "accepted", cancelled_at: nil)}
  scope :active_or_pending, -> {where("status='accepted' or status='pending' and  cancelled_at is null")}

  validate :unique_active_record, on: :create

  enum status: {
    pending: "pending",
    accepted: "accepted",
    inactive: "inactive"
  }

  def serializable_hash(options = nil)
    super(options).merge(
      customer_name: self.customer.name, 
      formatted_assigned_at: formatted_assigned_at,
      formatted_assigned_at_time: formatted_assigned_at_time,
      added_by: get_added_by_name_reversed
    )
  end

  private

  def unique_active_record
    exisitng_customer_user = CustomerUser.where(user_id: self.user_id, customer_id: self.customer_id, status: ["accepted", "pending"])
    if exisitng_customer_user.present?
      errors.add(:customer_id, "Active association already exists")
    end
  end

  def formatted_assigned_at
    self.assigned_at&.strftime("%m/%d/%Y")
  end

  def formatted_assigned_at_time
    self.assigned_at&.strftime("%l:%M %P")
  end

  def get_added_by_name_reversed
    self.created_by&.name_reversed
  end
end
