class RenameCountryToCountyOnPatientInsurance < ActiveRecord::Migration[6.0]
  def change
    rename_column :patient_insurances, :country, :county
  end
end
