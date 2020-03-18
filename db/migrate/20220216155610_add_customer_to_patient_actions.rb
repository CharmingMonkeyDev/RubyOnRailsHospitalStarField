class AddCustomerToPatientActions < ActiveRecord::Migration[6.0]
  def change
    add_reference :patient_actions, :customer, foreign_key: true
  end
end
