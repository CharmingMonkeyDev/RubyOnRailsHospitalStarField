# frozen_string_literal: true

def load_seeds(seeds)
  seeds.each do |seed|
    puts seed
    load File.join(Rails.root, 'db', 'seeds', "#{seed}.rb")
  end
end

# cannot create   action_categories, patient_action_groups

seeds = %w[
  cpt_codes
  privileges
  customers
  users 
  patient_medications 
  patient_devices 
  blood_pressure_readings 
  weight_readings
  action_categories
  resource_items
  action_pathways
  assigned_pathways
  assigned_pathway_actions
  customer_user_privileges
  glucose_readings
  patient_insurance_types
  patient_insurances
  adt_notifications
  patient_insurance_types
  encounter_billings
  notes_templates
]
load_seeds(seeds)
