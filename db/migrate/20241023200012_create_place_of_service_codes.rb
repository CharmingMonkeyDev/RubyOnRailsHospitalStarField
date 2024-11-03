class CreatePlaceOfServiceCodes < ActiveRecord::Migration[6.0]
  def change
    create_table :place_of_service_codes do |t|
      t.string :code
      t.string :name

      t.timestamps
    end
  end
end
