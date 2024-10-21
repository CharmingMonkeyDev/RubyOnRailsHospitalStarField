class CreateCptCodes < ActiveRecord::Migration[6.0]
  def change
    create_table :cpt_codes do |t|
      t.timestamps
      t.string :name
      t.string :code
    end
  end
end
