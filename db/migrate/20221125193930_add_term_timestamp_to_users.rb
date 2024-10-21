class AddTermTimestampToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :terms_timestamp, :datetime
  end
end
