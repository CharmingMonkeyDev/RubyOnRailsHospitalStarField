class AddQuestionnaireCategoryIdColumnToQuestionnaires < ActiveRecord::Migration[6.0]
  def change
    add_reference :questionnaires, :questionnaire_category, foreign_key: true, index: true, null: true
  end
end