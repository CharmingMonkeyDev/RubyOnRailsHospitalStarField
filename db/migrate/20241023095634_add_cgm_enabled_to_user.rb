class AddCgmEnabledToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :cgm_enabled, :boolean, default: false, null: false
  end
end
