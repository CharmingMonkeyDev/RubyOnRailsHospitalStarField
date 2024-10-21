class AddReferencedOnUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :adt_outbound_logs, :requested_by, foreign_key: { to_table: :users}
  end
end
