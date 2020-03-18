class AddJsonColumn < ActiveRecord::Migration[6.0]
  def change
    add_column :eb_send_charges_logs, :request_json, :jsonb
    add_column :eb_send_charges_logs, :validation_response_json, :jsonb
    add_column :eb_send_charges_logs, :submission_response_json, :jsonb
  end
end
