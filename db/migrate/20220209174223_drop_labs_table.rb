class DropLabsTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :patient_labs
  end
end
