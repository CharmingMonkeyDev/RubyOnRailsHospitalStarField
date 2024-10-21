class CreateAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :answers do |t|
      t.references :questionnaire_submission, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.text :answer_text

      t.timestamps
    end
  end
end
