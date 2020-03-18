class AddFacililyNpi < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :facility_npi, :string
  end
end
