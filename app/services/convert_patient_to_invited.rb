class ConvertPatientToInvited
    def initialize(attributes)
        @attributes = attributes
        @patient_id = @attributes[:patient_id]
    end

    def call
        process_conversion
    end

    private

    attr_accessor :patient_id

    def patient
        @patient ||= User.find(patient_id)
    end

    def process_conversion
        ActiveRecord::Base.transaction do
            patient.invite!(
            ) do |u|
                u.skip_invitation = true
            end
            patient.invite_token = Digest::SHA1.hexdigest(patient.email)
            patient.user_creation_type = "invitation_pending"
            patient.save!
            InvitePatientMailer.invite_patient(patient).deliver
            Result.new(patient, "Patient is successfully invited", true)
        end
        rescue => e
            Rollbar.warning("Error on patient conversion to invited #{e}")
            Result.new(nil, "Cannot send patient inviation", false)
    end
end