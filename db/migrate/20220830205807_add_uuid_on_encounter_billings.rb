class AddUuidOnEncounterBillings < ActiveRecord::Migration[6.0]
  enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

  def change
    add_column :encounter_billings, :uuid, :uuid, default: "gen_random_uuid()", null: false
  end
end
