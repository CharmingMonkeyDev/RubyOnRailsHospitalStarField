class CreateQuestionnaireResources < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_resources do |t|
      t.references :questionnaire, null: false, foreign_key: true
      t.references :resource_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
