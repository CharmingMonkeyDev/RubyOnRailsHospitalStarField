class CreateAdtInboundNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :adt_inbound_notifications do |t|
      t.string :file_name
      t.string :file_content
      t.timestamps
    end
  end
end
