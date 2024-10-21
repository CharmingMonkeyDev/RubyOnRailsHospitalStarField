class CreateQuestionnaireQrs < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_qrs do |t|
      t.uuid :uuid, default: -> { "gen_random_uuid()" }, null: false
      t.references :customer, null: false, foreign_key: true
      t.integer :patient_id
      t.integer :assigned_by_id
      t.boolean :is_valid, default: true

      t.timestamps
    end
  end
end
