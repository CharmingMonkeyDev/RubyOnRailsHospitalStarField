class CreateFollowUpDates < ActiveRecord::Migration[6.0]
  def change
    create_table :follow_up_dates do |t|
      t.references :user, null: false, foreign_key: true
      t.date :next_date
      t.timestamps
    end
  end
end
