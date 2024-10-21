class CreateProviderActionAdtNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :adt_provider_actions do |t|
      t.references :assigned_pathway_week_action, null: false, foreign_key: true
      t.references :adt_patient_notification, null: false, foreign_key: true

      t.timestamps
    end
  end
end
