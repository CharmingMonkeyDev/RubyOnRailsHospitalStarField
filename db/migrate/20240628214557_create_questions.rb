class CreateQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :questions do |t|
      t.string :title, null: false
      t.string :question_type, null: false
      t.references :questionnaire, null: false, foreign_key: true

      t.timestamps
    end
  end
end
