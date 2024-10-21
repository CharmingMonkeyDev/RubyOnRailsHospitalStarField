class CreateQuestionnaireActions < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_actions do |t|
      t.references :assigned_pathway_week_action, null: false, foreign_key: true
      t.references :questionnaire_submission, null: false, foreign_key: true

      t.timestamps
    end
  end
end
