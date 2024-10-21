class CreateCustomerSelections < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_selections do |t|
      t.timestamps
      t.references :user, null: false, foreign_key: true
      t.references :customer, null: false, foreign_key: true
      t.boolean :do_not_ask, default: false
    end
  end
end
