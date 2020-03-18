class AddCustomerIdOnEncounterBilling < ActiveRecord::Migration[6.0]
  def change
    add_reference :encounter_billings, :customer, index: true
  end
end
