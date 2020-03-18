class AddResourceIdToQuestionnairesTable < ActiveRecord::Migration[6.0]
  def change
    add_reference :questionnaires, :resource_item, null: true, foreign_key: true
  end
end
