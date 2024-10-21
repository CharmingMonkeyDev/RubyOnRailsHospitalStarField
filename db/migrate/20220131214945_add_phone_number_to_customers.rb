class AddPhoneNumberToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :phone_number, :string
  end
end
