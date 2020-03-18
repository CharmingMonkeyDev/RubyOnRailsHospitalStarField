# frozen_string_literal: true
class ProcessSqsMessageRead
    def initialize()
    end

    def call
        read_messages
    end

    private 

    def read_messages
        Aws.config.update({
        region: ENV["AWS_SQS_REGION"], # Replace with your desired AWS region
        credentials: Aws::Credentials.new(ENV["AWS_SQS_ACCESS_KEY"], ENV["AWS_SQS_SECRET_KEY"])
        })

        sqs = Aws::SQS::Client.new
        queue_url = ENV["AWS_SQS_QUEUE_URL"]

        result = sqs.receive_message({
            queue_url: queue_url,
            max_number_of_messages: 10, # Maximum number of messages to receive
            wait_time_seconds: 20, # Wait time for new messages (adjust as needed)
        })

        if result.messages.any?
            result.messages.each do |message|
                puts "Received message: #{message.body}"

                json_message = JSON.parse(message.body)
                # expecting message in this format
                # json_message = {
                #     service_name: service_name,
                #     user_id: user_id,
                # }
                SqsLog.create(message: json_message)

                service_name = json_message.dig("service_name")
                user_id = json_message.dig("user_id")
                available_services = [
                    "LinkPatientWithNDHIN",
                    "ProcessNdiisLink"
                ]
                if available_services.include?(service_name) && user_id.present?
                    user = User.find(user_id)
                    if service_name == "LinkPatientWithNDHIN"
                        patient_identifier = NdhinData.new.get_ndhin_patient_indentifier(user)
                        if patient_identifier
                            user.update(patient_identifier: patient_identifier)
                            GenerateAdtNotification.new({patient_id: user.id, requested_by_id: user.id, event_reason_code: "A"}).call
                        end
                    end

                    if service_name == "ProcessNdiisLink"
                        ProcessNdiisLink.new({user_id: user.id}).call
                    end
                end

                # Delete the message from the queue after processing
                sqs.delete_message({
                    queue_url: queue_url,
                    receipt_handle: message.receipt_handle
                })
            
            end
        else
            puts "No messages available in the queue."
        end
    end
end 