# reference to this DOC: https://developers.changehealthcare.com/eligibilityandclaims/docs/professional-claims-json-to-edi-contents
# More details billing info here: https://docs.google.com/spreadsheets/d/1cqRR6Hvv8J1CCjP3rjzgTDXfFZfHOZeOPEwpd6lzEyM/edit#gid=0 
# test values: https://developers.changehealthcare.com/eligibilityandclaims/docs/sandbox-predefined-fields-and-values
class ProcessSendChargesChangeHealthcare
    def initialize(attributes)
        @attributes = attributes
        @encounter_billing_id = attributes[:encounter_billing_id]
    end

    def call
        result = process_billing_send_charges
    end

    private
    attr_accessor :encounter_billing_id

    def encounter_billing
        @encounter_billing ||= EncounterBilling.find(encounter_billing_id)
    end

    def encounter_insurance_information
        @encounter_insurance_information ||= encounter_billing.encounter_insurance_information
    end

    def submitter
        @customer ||= encounter_billing.customer
    end

    def is_dev?
        Rails.env.development?
    end

    # process functions
    def process_billing_send_charges
        json_data = generate_billing_json
        statuses = validate_and_submit(json_data)
        return statuses
    end

    def validate_and_submit(json_data)
        change_hc_obj = ChangeHealthcareApi.new
        submission_json = nil
        validation_json = change_hc_obj.validate_data(json_data)
        if validation_json&.dig("status") == "SUCCESS"
            submission_json = change_hc_obj.submit_data(json_data)
        end
        log = encounter_billing.eb_send_charges_logs.create!(
            request_json: json_data,
            validation_response_json: validation_json,
            submission_response_json: submission_json
        )
        return {
            validation_status: validation_json&.dig("status"),
            submission_status: submission_json&.dig("status"),
            eb_send_charges_log_id: log.id
        }
    end
    
    def generate_billing_json
        {
            controlNumber: get_control_number,
            tradingPartnerServiceId: get_trading_partner_service_id,
            submitter: {
                organizationName: get_submitter_organization_name, #use customer for submitter
                contactInformation: {
                    name: get_submitter_contact_name,
                    phoneNumber: get_submitter_phone_number
                }
            },
            receiver: {
                organizationName: get_receiver_organization_name
            },
            subscriber: BillingSubscriber.new(encounter_billing_id).get_subscriber,
            # dependent: BillingSubscriber.new(encounter_billing_id).get_dependent,
            claimInformation: BillingClaim.new(encounter_billing_id).get_claim_info,
            providers: [
                {
                    providerType: get_provider_type,
                    npi: get_provider_npi,
                    organizationName: get_submitter_organization_name,
                    employerId: get_employer_id,
                    lastName: get_provider_last_name,
                    address: {
                        address1: get_provider_address,
                        city: get_provider_city,
                        state: get_provider_state,
                        postalCode: get_provider_zip
                    }
                }
            ]
            
        }
    end

    def get_control_number
        if is_dev?
          return "123456789"  
        end
        return encounter_billing&.interchange_number
    end

    def get_trading_partner_service_id
        # get code from here https://payerfinder.changehealthcare.com/cap
        # For now we have a field on insurance panel
        return encounter_insurance_information.service_partner_id
    end

    def get_submitter_organization_name
        if is_dev?
            return "happy doctors group"
        end
        return submitter&.name
    end

    def get_submitter_contact_name
        if is_dev?
            return "submitter contact info"
        end
        return submitter&.name
    end

    def get_submitter_phone_number
        if is_dev?
            return "123456789"
        end
        return submitter&.phone_number
    end

    def get_receiver_organization_name
        # this is receiving insurance org name, eg North Dakota Medicaid
        return encounter_insurance_information&.insurance_type
    end
    
    def get_provider_type
        # TODO, use "BillingProvider" until referring provider is present
        return "BillingProvider"
    end

    def get_provider_npi
        if is_dev?
            return "1760854442"
        end
        return submitter.facility_npi
    end

    def get_employer_id
        if is_dev?
            return "123456789"
        end
        return submitter&.federal_tax_id
    end

    def get_provider_last_name
        if is_dev?
            return "doeone"
        end
        return encounter_billing.created_by&.last_name
    end

    def get_provider_address
        if is_dev?
            return "123 address1"
        end
        return submitter&.address
    end

    def get_provider_city
        if is_dev?
            return "city1"
        end
        return submitter.city
    end

    def get_provider_state
        if is_dev?
            return "wa"
        end
        return submitter.state&.downcase
    end

    def get_provider_zip
        if is_dev?
            return "981010000"
        end
        return submitter.zip
    end
end