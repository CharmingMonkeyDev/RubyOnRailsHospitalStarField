class CreateOptions < ActiveRecord::Migration[6.0]
  def change
    create_table :options do |t|
      t.string :title, null: false
      t.references :question, null: false, foreign_key: true

      t.timestamps
    end
  end
end
