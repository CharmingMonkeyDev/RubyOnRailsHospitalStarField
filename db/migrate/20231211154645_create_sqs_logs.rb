class CreateSqsLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :sqs_logs do |t|
      t.jsonb :message
      t.timestamps
    end
  end
end
