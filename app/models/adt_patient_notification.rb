class AdtPatientNotification < ApplicationRecord
    belongs_to :user, optional: true
    belongs_to :adt_inbound_notification
    has_one :adt_provider_action
    has_one :assigned_pathway_week_action, through: :adt_provider_action

    before_save :serialize_patient_class

    enum patient_class_option: {
        "B": "Obstetrics",
        "C": "Commercial Account",
        "E": "Emergency",
        "I": "Inpatient",
        "N": "Not Applicable",
        "O": "Outpatient",
        "P": "Preadmit",
        "R": "Recurring patient",
        "U": "Unknown"
    }

    def serializable_hash(options = nil)
        super(options).merge(
            formatted_event_date: format_event_date, 
        )
    end

    private

    def serialize_patient_class
        unless AdtPatientNotification.patient_class_options.values.include? self.patient_class
            spelled_class = AdtPatientNotification.patient_class_options[self.patient_class]
            self.patient_class = spelled_class
        end
    end

    def format_event_date
        self.event_date&.strftime("%m/%d/%Y %I:%M %P")
    end
end
