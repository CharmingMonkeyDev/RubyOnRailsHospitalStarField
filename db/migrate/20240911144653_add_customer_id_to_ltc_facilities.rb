class AddCustomerIdToLtcFacilities < ActiveRecord::Migration[6.0]
  def change
    add_column :ltc_facilities, :customer_id, :bigint
  end
end
