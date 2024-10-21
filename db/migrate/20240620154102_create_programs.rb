class CreatePrograms < ActiveRecord::Migration[6.0]
  def change
    create_table :programs do |t|
      t.string  :title, null: false

      t.datetime "published_at"
      t.string "subtext"
      t.string "status", default: "draft"
      t.boolean "is_archived", default: false
      t.references :customer, foreign_key: true

      t.timestamps
    end
  end
end
