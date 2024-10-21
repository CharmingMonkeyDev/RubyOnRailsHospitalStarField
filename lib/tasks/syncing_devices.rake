namespace :syncing_devices do
  task disconnected_devices: :environment do

    # Get synced accounts that are two days old
    outdated_accounts = SyncedAccount.includes(:glucose_readings).select do |account|
      account.latest_system_reading_older_than?(2.days) && account.latest_system_reading_older_than?(3.days) == false
    end

    outdated_accounts.each do |account|
        SyncedAccountMailer.glucose_device_syncing(account.user).deliver
    end
  end
end