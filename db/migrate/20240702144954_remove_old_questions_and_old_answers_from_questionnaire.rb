class RemoveOldQuestionsAndOldAnswersFromQuestionnaire < ActiveRecord::Migration[6.0]
  def change
    remove_column :questionnaires, :old_questions, :json
    remove_column :questionnaire_submissions, :old_answers, :json
  end
end
