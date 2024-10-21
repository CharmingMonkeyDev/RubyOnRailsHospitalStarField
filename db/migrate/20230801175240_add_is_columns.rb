class AddIsColumns < ActiveRecord::Migration[6.0]
  def change
    add_column :patient_forecast_immunizations, :defer_date, :date
    add_column :patient_forecast_immunizations, :given_date, :date
    add_column :patient_forecast_immunizations, :is_deleted, :boolean, default: false
  end
end
