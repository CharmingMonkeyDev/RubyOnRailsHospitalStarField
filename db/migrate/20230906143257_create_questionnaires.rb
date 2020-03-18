class CreateQuestionnaires < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaires do |t|
      t.references :user, null: false, foreign_key: true
      t.references :customer, null: false, foreign_key: true
      t.string :name
      t.string :description
      t.string :category
      t.string :status
      t.jsonb :questions

      t.timestamps
    end
  end
end
