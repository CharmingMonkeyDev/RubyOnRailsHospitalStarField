class DropPharmacyGroupTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :pharmacy_groups
  end
end
