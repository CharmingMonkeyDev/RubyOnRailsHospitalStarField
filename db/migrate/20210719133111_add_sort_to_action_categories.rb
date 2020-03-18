# frozen_string_literal: true

class AddSortToActionCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :action_categories, :sort, :integer
  end
end
