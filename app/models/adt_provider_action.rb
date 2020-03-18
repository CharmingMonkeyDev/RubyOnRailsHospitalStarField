class AdtProviderAction < ApplicationRecord
  belongs_to :assigned_pathway_week_action
  belongs_to :adt_patient_notification
end
