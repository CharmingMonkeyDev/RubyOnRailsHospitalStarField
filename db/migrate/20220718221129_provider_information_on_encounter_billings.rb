class ProviderInformationOnEncounterBillings < ActiveRecord::Migration[6.0]
  def change
    add_column :encounter_billings, :provider_name, :string
    add_reference :encounter_billings, :created_by, foreign_key: { to_table: :users}, required: false
  end
end
