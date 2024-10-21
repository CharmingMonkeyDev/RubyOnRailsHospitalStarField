class AddFederalTaxIdOnCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :federal_tax_id, :string
  end
end
