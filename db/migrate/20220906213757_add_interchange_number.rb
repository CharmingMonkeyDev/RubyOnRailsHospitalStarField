class AddInterchangeNumber < ActiveRecord::Migration[6.0]
  def change
    add_column :encounter_billings, :interchange_number, :string
    add_column :encounter_billings, :transaction_set_number, :string
  end
end
