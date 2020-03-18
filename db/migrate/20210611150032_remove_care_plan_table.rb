# frozen_string_literal: true

class RemoveCarePlanTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :patient_care_plan_rows
  end
end
