class CreateAdtOutboundLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :adt_outbound_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.datetime :message_date
      t.string :message_control_id
      t.string :request_payload

      t.timestamps
    end
  end
end
