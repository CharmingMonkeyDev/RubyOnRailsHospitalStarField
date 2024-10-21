class ChangeNullConstrain < ActiveRecord::Migration[6.0]
  def change
    change_column_null :users, :pharmacy_group_id, true
  end
end
