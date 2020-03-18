# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
set :output, "/var/app/current/log/cron_log.log"
#

every 1.days, at: '12:00am' do
  rake "fetch:adt_files"
end

# this is UTC time, which is 3:00am central
every 1.days, at: '9:00am' do
  rake "generate:recurring_task"
end

every 1.days, at: '9:00am' do
  rake "generate:deferred_task"
end

every 1.days, at: '12:00am' do
  rake "syncing_devices:disconnected_devices"
end

every 3.hours do
  rake "dexcom_sync:glucose_readings"
end


# this is UTC time, which is 6:00am central
# every 1.days, at: '12:00pm' do
#   rake "chat_notifications:sms"
# end

# this is UTC time, which is 12:00am central
every 1.days, at: '6:00am' do
  rake "ambulatory_precalc"
end

every 1.days, at: '6:00am' do
  rake "fetch:ndiis_forecast"
end

# getting sqs messages
every 30.minutes do
  rake "get:sqs_messages"
end
