class CreateProviderActionResources < ActiveRecord::Migration[6.0]
  def change
    create_table :provider_action_resources do |t|
      t.references :action, null: false, foreign_key: true
      t.references :resource_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
