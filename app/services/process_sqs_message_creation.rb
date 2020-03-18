# frozen_string_literal: true
class ProcessSqsMessageCreation
    def initialize(attributes)
        @attributes = attributes
        @service_name = @attributes[:service_name] # for processable service names please check ProcessSqsMessageRead
        @user_id = @attributes[:user_id]
    end

    def call
        create_message_queue
    end

    private 

    attr_accessor :service_name, :user_id

    def create_message_queue
        Aws.config.update({
        region: ENV["AWS_SQS_REGION"], # Replace with your desired AWS region
        credentials: Aws::Credentials.new(ENV["AWS_SQS_ACCESS_KEY"], ENV["AWS_SQS_SECRET_KEY"])
        })

        # # Create an SQS client
        sqs = Aws::SQS::Client.new

        queue_name = ENV["AWS_SQS_QUEUE_NAME"]
        queue_url = sqs.create_queue(queue_name: queue_name).queue_url

        data = {
            service_name: service_name,
            user_id: user_id,
        }
        message_body = data.to_json
        sqs.send_message(queue_url: queue_url, message_body: message_body)
    end
end 