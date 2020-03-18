class AddDisplayOnTablet < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaires, :display_on_tablet, :boolean, default: false
  end
end
