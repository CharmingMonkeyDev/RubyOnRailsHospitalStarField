class AssignedProgram < ApplicationRecord
  belongs_to :patient, class_name: "User", foreign_key: "patient_id"
  belongs_to :program
  has_many :actions, through: :program
  has_many :action_steps, through: :actions
  has_many :assignment_histories, as: :loggable, dependent: :destroy
  has_many :action_queues, dependent: :destroy

  scope :for_customer, ->(customer_id) { joins(:program).where(programs: { customer_id: customer_id }) }
  
  validate :unique_active_program_per_patient, on: :create
  enum status: {
    active: "active",
    completed: "completed",
    manually_completed: "manually_completed",
  }

  private

  def unique_active_program_per_patient
    if AssignedProgram.where(patient_id: patient_id, program_id: program_id, status: 'active')
                      .where.not(id: id)
                      .exists?
      errors.add(:program_id, 'has already been assigned to this patient with an active status.')
    end
  end
end
