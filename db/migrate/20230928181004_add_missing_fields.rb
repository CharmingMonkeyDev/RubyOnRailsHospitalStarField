class AddMissingFields < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :county, :string
    add_column :users, :county, :string
    add_column :users, :race, :string
    add_column :users, :ethnicity, :string
    add_reference :patient_forecast_immunizations, :provider, foreign_key: {to_table: :users}
  end
end
