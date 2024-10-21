class CreateCustomers < ActiveRecord::Migration[6.0]
  def change
    create_table :customers do |t|
      t.timestamps
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.string :notes
      t.string :status
    end
  end
end
