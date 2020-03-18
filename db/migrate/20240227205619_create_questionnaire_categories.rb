class CreateQuestionnaireCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_categories do |t|
      t.references :customer, foreign_key: true
      t.string :display_name
      t.string :db_name
      t.boolean :is_default
      t.string :icon

      t.timestamps
    end
  end
end
