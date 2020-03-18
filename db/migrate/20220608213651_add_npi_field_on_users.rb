class AddNpiFieldOnUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :provider_npi_number, :string
  end
end
