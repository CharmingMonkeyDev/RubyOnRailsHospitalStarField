# frozen_string_literal: true

class CreateResourceItems < ActiveRecord::Migration[6.0]
  def change
    create_table :resource_items do |t|
      t.string :name
      t.string :link_url
      t.string :resource_type
      t.boolean :is_deleted, default: false
      t.references :pharmacy_group, null: false, foreign_key: true

      t.timestamps
    end
  end
end
