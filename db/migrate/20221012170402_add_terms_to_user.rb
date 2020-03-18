class AddTermsToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :terms, :boolean, default:false
  end
end
