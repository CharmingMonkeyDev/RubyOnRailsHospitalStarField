class AddRenderingProvField < ActiveRecord::Migration[6.0]
  def change
    remove_column :encounter_claim_informations, :rendering_provider
    add_column :encounter_billings, :rendering_provider, :string
  end
end
