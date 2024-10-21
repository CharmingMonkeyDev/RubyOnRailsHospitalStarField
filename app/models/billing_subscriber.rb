class BillingSubscriber
    def initialize(encounter_billing_id)
        @encounter_billing_id = encounter_billing_id
    end

    def get_subscriber
        get_subscriber_json
    end

    def get_dependent
        get_dependent_json
    end

    private
    attr_accessor :encounter_billing_id

    def encounter_billing
        @encounter_billing ||= EncounterBilling.find(encounter_billing_id)
    end

    def encounter_insurance_information
        @encounter_insurance_information ||= encounter_billing.encounter_insurance_information
    end

    def patient
        @patient ||= encounter_billing.patient
    end

    def is_dev?
        Rails.env.development?
    end

    def get_subscriber_json
        {
            memberId: get_subscriber_insurance_id,
            paymentResponsibilityLevelCode: get_payment_responsibility_code,
            firstName: get_subscriber_first_name,
            lastName: get_subscriber_last_name,
            gender: get_subscriber_gender,
            dateOfBirth: get_subscriber_dob,
            policyNumber: get_subscriber_policy_number,
            address: {
                address1: get_subscriber_address1,
                city: get_subscriber_city,
                state: get_subscriber_state,
                postalCode: get_subscriber_postalcode
            }
        }
    end

    def get_dependent_json
        {
            memberId: get_subscriber_insurance_id,
            paymentResponsibilityLevelCode: get_payment_responsibility_code,
            firstName: get_dependent_first_name,
            lastName: get_dependent_last_name,
            gender: get_dependent_gender,
            dateOfBirth: get_dependent_dob,
            policyNumber: get_subscriber_policy_number,
            relationshipToSubscriberCode: get_relationship_with_subscriber_code,
            address: {
                address1: get_dependent_address,
                city: get_dependent_city,
                state: get_dependent_state,
                postalCode: get_dependent_zip
            }
        }
    end

    def get_subscriber_insurance_id
        if is_dev?
            return "0000000006"
        end
        return encounter_insurance_information&.insured_id
    end

    def get_payment_responsibility_code
        relationship = encounter_billing.encounter_insurance_information.relationship
        if relationship == "self"
            return "P"
        else
            return "S"
        end
    end

    def get_relationship_with_subscriber_code
         relationship = encounter_billing.encounter_insurance_information.relationship
        if relationship == "self"
            return "18"
        elsif relationshp == "spouse"
            return "01"
        elsif relationshp == "child"
            return "19"
        elsif relationshp == "ohter"
            return "G8"
        end
    end

    def get_subscriber_first_name
        # full_name is in format [last, First, MI]
        if is_dev?
            return "johnone"
        end
        full_name = encounter_insurance_information.insured_name
        first_name = full_name.split.second
        return first_name
    end

    def get_subscriber_last_name
        # full_name is in format [last, First, MI]
        if is_dev?
            return "doeone"
        end
        full_name = encounter_insurance_information.insured_name
        last_name = full_name.split.first
        return last_name
    end

    def get_subscriber_gender
        gender = encounter_insurance_information.insured_sex
        if gender == "male"
            return "M"
        else
            return "F"
        end
    end

    def get_subscriber_dob
        if is_dev?
            return "20000101"
        end
        return encounter_insurance_information.insured_dob&.strftime("%Y%m%d")
    end

    def get_subscriber_policy_number
        encounter_insurance_information.feca_number
    end

    def get_subscriber_address1
        if is_dev?
           return "123 address1" 
        end
        return encounter_insurance_information.address
    end

    def get_subscriber_city
        if is_dev?
            return "city1"
        end
        return encounter_insurance_information.city
    end

    def get_subscriber_state
        if is_dev?
            return "wa"
        end
        return encounter_insurance_information.state&.downcase
    end

    def get_subscriber_postalcode
        if is_dev?
            return "981010000"
        end
        return encounter_insurance_information.zip
    end

    def get_dependent_first_name
        if is_dev?
            return "johnone"
        end
        return patient.first_name
    end

    def get_dependent_last_name
        if is_dev?
            return "doeone"
        end
        return patient.last_name
    end

    def get_dependent_gender
        gender = patient.gender&.downcase
        if gender == "male"
            return "M"
        else
            return "F"
        end
    end

    def get_dependent_dob
        if is_dev?
            return "20000101"
        end
        return patient.date_of_birth&.strftime("%Y%m%d")
    end

    def get_dependent_address
        if is_dev?
           return "123 address1" 
        end
        return patient.address
    end

    def get_dependent_city
        if is_dev?
            return "city1"
        end
        return patient.city
    end

    def get_dependent_state
        if is_dev?
            return "tn"
        end
        return patient.state&.downcase
    end

    def get_dependent_zip
        if is_dev?
            return "981010000"
        end
        return patient.zip
    end

    
end