class AssignedProviderAction < ApplicationRecord
  belongs_to :patient, class_name: "User", foreign_key: "patient_id"
  belongs_to :action
  has_many :action_steps, through: :action
  has_many :assignment_histories, as: :loggable, dependent: :destroy
  has_many :action_queues, dependent: :destroy
  
  scope :for_customer, ->(customer_id) { joins(:action).where(actions: { customer_id: customer_id }) }
  enum status: {
    active: "active",
    completed: "completed",
    manually_completed: "manually_completed",
  }

  validate :unique_active_action_per_patient

  private

  def unique_active_action_per_patient
    if AssignedProviderAction.where(patient_id: patient_id, action_id: action_id, status: 'active')
                             .where.not(id: id)
                             .exists?
      errors.add(:action_id, 'is assigned to this patient and is in active status.')
    end
  end
end
