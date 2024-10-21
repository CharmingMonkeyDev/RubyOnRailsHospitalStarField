class AddPublishedAtOnQuestionnaires < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaires, :published_at, :datetime
  end
end
