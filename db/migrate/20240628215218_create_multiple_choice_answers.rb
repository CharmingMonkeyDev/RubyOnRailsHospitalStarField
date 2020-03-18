class CreateMultipleChoiceAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :multiple_choice_answers do |t|
      t.references :answer, null: false, foreign_key: true
      t.references :option, null: false, foreign_key: true

      t.timestamps
    end
  end
end
