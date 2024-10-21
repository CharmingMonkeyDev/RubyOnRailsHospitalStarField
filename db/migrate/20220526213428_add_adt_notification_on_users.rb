class AddAdtNotificationOnUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :adt_notifications_turned_on, :boolean, default: false
  end
end
