class CreateNdmReports < ActiveRecord::Migration[6.0]
  def change
    create_table :ndm_reports do |t|
      t.string :status, default: "processing"
      t.jsonb :data
      t.jsonb :issues

      t.timestamps
    end
  end
end
