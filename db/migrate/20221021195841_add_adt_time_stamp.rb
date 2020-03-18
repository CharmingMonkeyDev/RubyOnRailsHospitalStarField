class AddAdtTimeStamp < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :adt_notif_modified_at, :datetime
  end
end
