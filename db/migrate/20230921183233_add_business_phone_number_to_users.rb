class AddBusinessPhoneNumberToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :business_phone_number, :string
  end
end
