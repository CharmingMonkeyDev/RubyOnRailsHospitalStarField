require 'net/sftp'

# Notifies NDHIN about ADT on and off status by generating files and uploading them to sftp server
class GenerateAdtNotification
    def initialize(attributes)
        @attributes = attributes
        @patient_id = @attributes[:patient_id]
        @requested_by_id = @attributes[:requested_by_id]
        @event_reason_code = @attributes[:event_reason_code]
    end

    def call
        response = process_notification
        if response
            return Result.new(nil, "ADT notification turned on", true)
        else
            return Result.new(nil, "ADT notification cannot be turned on", true)
        end
    end

    private 

    attr_accessor :patient_id, :requested_by_id, :event_reason_code

    def patient
        @patient ||= User.find(patient_id)
    end

    def requested_by
        @requested_by ||= User.find(requested_by_id)
    end

    def adt_outbound_log
        @adt_outbound_log ||= AdtOutboundLog.create!(
            user: patient,
            message_date: Time.now,
            requested_by: requested_by
        )
    end

    def process_notification
        message_control_id = adt_outbound_log.message_control_id
        file_name = get_file_name
        save_path = Rails.root.join("tmp", file_name)
        
        msh_segment = get_msh
        evn_segment = get_evn
        pid_segment = get_pid

        notification_string = msh_segment + "\r" + evn_segment + "\r" + pid_segment
        adt_outbound_log.update(request_payload: notification_string)
        
        File.open(save_path, "wb") do |file|
            file << notification_string
        end

        create_file_on_sftp_server(file_name)
    end

    def get_msh
        msh = HL7::MSH.new
        msh.date_time_of_message = adt_outbound_log.message_date.strftime("%Y%m%d%H%I%S")
        msh.message_control_id = adt_outbound_log.message_control_id
        msh.get_segment
    end

    def get_evn
        evn = HL7::EVN.new
        evn.event_reason_code = event_reason_code
        evn.recorded_date_time = adt_outbound_log.message_date.strftime("%Y%m%d%H%I%S")
        evn.get_segment
    end

    def get_pid
        pid = HL7::PID.new
        pid.patient_name = get_name
        pid.patient_identifier = patient.mrn_number
        pid.patient_dob =  patient.date_of_birth&.strftime("%Y%m%d")
        pid.patient_sex = get_gender
        pid.patient_address = get_address
        pid.patient_phone_number = patient.mobile_phone_number&.gsub(/[-()]/, "")
        pid.get_segment
    end

    def get_file_name
        name_date = adt_outbound_log.message_date.strftime("%Y%m%d%H%I%S")
        name = "#{patient.mrn_number}.#{name_date}"
    end

    def create_file_on_sftp_server(file_name)
        if ENV["ADT_INTEGRATON_ON"] == "true"
            begin
                Timeout.timeout(30) do 
                    Net::SFTP.start(ENV["ADT_SFTP_HOST"], ENV["ADT_SFTP_USERNAME"], :password => ENV["ADT_SFTP_PASSWORD"]) do |sftp|
                        # upload a file or directory to the remote host
                        sftp.upload!("tmp/#{file_name}", "#{ENV["ADT_SFTP_OUTBOUND_DIR"]}/#{file_name}")
                    end
                    update_patient_notification_status
                    return true
                end
            rescue StandardError => e
                Rollbar.warning("Error from create_file_on_sftp_server #{e}")
                return false
            end
        else
            update_patient_notification_status
            return true
        end
    end

    def get_name
        name = []

        if patient.last_name&.present?
            name << patient.last_name
        end

        if patient.first_name&.present?
            name << patient.first_name
        end

        if patient.middle_name&.present?
            name << patient.middle_name
        end

        name.join("^")
    end

    def get_gender
        if patient.gender&.downcase == "male"
            return "M"
        elsif patient.gender&.downcase == "female"
            return "F"
        end
    end

    def get_address
        address = []
        address << patient.address
        address << "" #this is PID 11.2 other designation
        address << patient.city
        address << patient.state
        address << patient.zip

        address.join("^")
    end

    def update_patient_notification_status
        if event_reason_code == "A"
            patient.update(adt_notifications_turned_on: true, adt_notif_modified_at: Time.now)
        elsif event_reason_code == "I"
            patient.update(adt_notifications_turned_on: false, adt_notif_modified_at: Time.now)
        end
    end
end