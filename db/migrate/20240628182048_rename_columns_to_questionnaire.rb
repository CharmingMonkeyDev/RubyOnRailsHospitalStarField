class RenameColumnsToQuestionnaire < ActiveRecord::Migration[6.0]
  def up
    rename_column :questionnaires, :questions, :old_questions
    rename_column :questionnaire_submissions, :answers, :old_answers
  end

  def down
    rename_column :questionnaires, :old_questions, :questions
    rename_column :questionnaire_submissions, :old_answers, :answers
  end
end
