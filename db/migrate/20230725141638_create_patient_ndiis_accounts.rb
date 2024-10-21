class CreatePatientNdiisAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_ndiis_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :ndiis_patient_id

      t.timestamps
    end
  end
end
