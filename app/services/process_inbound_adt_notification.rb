class ProcessInboundAdtNotification
    include LogHelper
    
    def initialize(attributes)
        @attributes = attributes
        @adt_inbound_notification_id = attributes[:adt_inbound_notification_id]
    end

    def call
        process_inbound_notif
    end

    private

    attr_accessor :adt_inbound_notification_id

    def adt_inbound_notification
        @adt_inbound_notification ||= AdtInboundNotification.find(adt_inbound_notification_id)
    end

    def file_content
        @file_content ||= adt_inbound_notification.file_content
    end

    def file_name
        @file_name ||= adt_inbound_notification.file_name
    end

    def get_event_type(parsed_file_content)
        return parsed_file_content&.dig("MSH")&.dig("9")&.dig("2")
    end

    def process_inbound_notif
        parsed_file_content = HL7::ParseFile.new({file_content: file_content}).call
        adt_patient_notification = AdtPatientNotification.create!(
            user_id: get_user_id(parsed_file_content),
            adt_inbound_notification_id: adt_inbound_notification.id,
            message_control_id: parsed_file_content&.dig("MSH")&.dig("10"),
            event_date: get_message_date(parsed_file_content),
            event_type: parsed_file_content&.dig("MSH")&.dig("9")&.dig("2"),
            patient_class: parsed_file_content&.dig("PV1")&.dig("2"),
            facility_name: parsed_file_content&.dig("PV1")&.dig("3")&.dig("4"),
            diagnosis: parsed_file_content&.dig("DG1")&.dig("3")&.dig("2"),
        )

        # Action depending on discharge record
        if adt_patient_notification.event_type == "A03"
            puts "Calling ProcessAdtDischargeActionQueue" if Rails.env.development?
            ProcessAdtDischargeActionQueue.new({adt_patient_notification_id: adt_patient_notification.id}).call
        end
        adt_patient_notification
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --ProcessInboundAdtNotification::process_inbound_notif")
    end

    def get_message_date(parsed_file_content)
        event_type = get_event_type(parsed_file_content)
        if event_type == "A03"
            return parsed_file_content&.dig("PV1")&.dig("45")
        elsif event_type.present?
            return parsed_file_content&.dig("PV1")&.dig("44")
        end
        nil
    end

    def get_user_id(parsed_file_content)
        mrn_number = parsed_file_content&.dig("PID")&.dig("3").class == Hash ? parsed_file_content&.dig("PID")&.dig("3")&.dig("1") : parsed_file_content&.dig("PID")&.dig("3")
        user = User.where(mrn_number: mrn_number)&.first if mrn_number.present?

        if user.present?
            user.id
        else
            nil
        end
    end
end