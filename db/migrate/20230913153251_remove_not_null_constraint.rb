class RemoveNotNullConstraint < ActiveRecord::Migration[6.0]
  def change
    change_column_null :eb_send_charges_logs, :user_id, true
  end
end
