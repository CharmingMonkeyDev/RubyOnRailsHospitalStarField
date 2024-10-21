class AddPlaceOfServiceCodeOnCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :place_of_service_code, :string
  end
end
