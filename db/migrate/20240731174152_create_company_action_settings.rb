class CreateCompanyActionSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :company_action_settings do |t|
      t.references :customer
      t.integer :global_incomplete_action_days
      t.integer :global_complete_action_future_days
      t.integer :global_complete_action_past_days
      t.integer :patient_incomplete_action_days
      t.integer :patient_complete_action_future_days
      t.integer :patient_complete_action_past_days 
      
      t.timestamps
    end
  end
end
