class CreatePatientForecastImmunizations < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_forecast_immunizations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :vaccine_type
      t.integer :dose_number
      t.datetime :recommended_date
      t.datetime :minimum_valid_date
      t.timestamps
    end
  end
end
