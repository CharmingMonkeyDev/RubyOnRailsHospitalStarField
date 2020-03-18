class CreatePatientInsuranceTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :patient_insurance_types do |t|
      t.string :insurance_type, null: false
      t.boolean :display_on_ui, null: false
      t.integer :sort_order, null: false
      t.timestamps
    end
  end
end
