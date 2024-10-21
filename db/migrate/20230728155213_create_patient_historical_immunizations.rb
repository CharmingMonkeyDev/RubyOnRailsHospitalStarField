class CreatePatientHistoricalImmunizations < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_historical_immunizations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :vaccine_name
      t.datetime :immunization_date

      t.timestamps
    end
  end
end
