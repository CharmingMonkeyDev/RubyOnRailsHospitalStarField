class AddCategoryToActions < ActiveRecord::Migration[6.0]
  def change
    add_column :actions, :category, :string
  end
end
