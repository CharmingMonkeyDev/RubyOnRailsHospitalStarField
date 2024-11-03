namespace :recurring_actions do
  desc "Rake task to generate recurring actions"

  task :generate, [:patient_id] => :environment do |task, args|
    Rails.logger.info("Running task 'recurring_actions:generate...'")
    patient_id = args[:patient_id]
    if patient_id.present?
      Rails.logger.info("Running task for patient ID: #{patient_id}")
      CreateDailyLiveActions.new(patient_id: patient_id).call
    else
      puts "Running task for all patients"
      # Call the service without a patient_id
      Rails.logger.info("Running task for all patients")
      CreateDailyLiveActions.new(patient_id: nil).call
    end
  end
end
