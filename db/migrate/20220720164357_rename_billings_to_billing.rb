class RenameBillingsToBilling < ActiveRecord::Migration[6.0]
  def change
    rename_column :encounter_billing_loggers, :encounter_billings_id, :encounter_billing_id
  end
end
