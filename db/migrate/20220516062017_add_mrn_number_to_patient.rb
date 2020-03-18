class AddMrnNumberToPatient < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :mrn_number, :integer
  end
end
