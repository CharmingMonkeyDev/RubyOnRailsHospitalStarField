class AddArchiveColumnToQuestionnaireCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaire_categories, :is_archived, :boolean, :default => false
  end
end