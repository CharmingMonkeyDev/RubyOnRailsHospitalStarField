class CreateEncounterBillingLoggers < ActiveRecord::Migration[6.0]
  def change
    create_table :encounter_billing_loggers do |t|
      t.timestamps
      t.references :encounter_billings, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :action
    end
  end
end
