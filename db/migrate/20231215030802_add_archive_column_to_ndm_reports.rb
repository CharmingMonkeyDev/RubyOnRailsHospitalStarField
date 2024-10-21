class AddArchiveColumnToNdmReports < ActiveRecord::Migration[6.0]
  def change
    add_column :ndm_reports, :is_archived, :boolean, :default => false
  end
end
