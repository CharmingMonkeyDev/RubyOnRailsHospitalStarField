class CreateQuestionnaireSubmissions < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_submissions do |t|
      t.references :questionnaire_assignment, null: false, foreign_key: true
      t.references :user, foreign_key: true
      t.jsonb :answers
      t.timestamps
    end
  end
end
