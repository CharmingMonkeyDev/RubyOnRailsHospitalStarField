class CreateBoardMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :board_messages do |t|
      t.references :user, null: false, foreign_key: true
      t.references :customer, null: false, foreign_key: true
      t.string :message

      t.timestamps
    end
  end
end
