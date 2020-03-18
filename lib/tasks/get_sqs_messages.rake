namespace :get do
  task sqs_messages: :environment do
    ProcessSqsMessageRead.new().call
  end
end
