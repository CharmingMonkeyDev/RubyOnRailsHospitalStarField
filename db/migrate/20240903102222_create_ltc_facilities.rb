class CreateLtcFacilities < ActiveRecord::Migration[6.0]
  def change
    create_table :ltc_facilities do |t|
      t.string :name
      t.string :address_1
      t.string :address_2
      t.string :city
      t.string :state
      t.string :zip
      t.string :phone_number
    end
  end
end