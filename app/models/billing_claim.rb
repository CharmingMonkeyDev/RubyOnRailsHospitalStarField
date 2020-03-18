# https://docs.google.com/spreadsheets/d/1cqRR6Hvv8J1CCjP3rjzgTDXfFZfHOZeOPEwpd6lzEyM/edit#gid=0
class BillingClaim
    def initialize(encounter_billing_id)
        @encounter_billing_id = encounter_billing_id
    end

    def get_claim_info
        get_claim_json
    end

    private
    attr_accessor :encounter_billing_id

    def encounter_billing
        @encounter_billing ||= EncounterBilling.find(encounter_billing_id)
    end

    def encounter_insurance_information
        @encounter_insurance_information ||= encounter_billing.encounter_insurance_information
    end

    def encounter_claim_informations 
        # this is ActiveRecord relations of encounterClaim
        @encounter_claim_informations ||= encounter_billing.encounter_claim_informations
    end

    def is_dev?
        Rails.env.development?
    end

    def get_claim_json
        {
            claimFilingCode: get_claim_filing_code,
            patientControlNumber: get_patient_control_number,
            claimChargeAmount: get_claim_charge_amount,
            placeOfServiceCode: get_place_of_service_code,
            claimFrequencyCode: get_claim_frequency,
            signatureIndicator: get_signature_indicator,
            planParticipationCode: get_plan_participation_code,
            benefitsAssignmentCertificationIndicator: get_baci,
            releaseInformationCode: get_release_information_code,
            healthCareCodeInformation: get_healthcare_code_info,
            serviceLines: get_service_line_data
        }
    end

    def get_claim_filing_code
        return encounter_insurance_information.claim_filing_code
    end

    def get_patient_control_number
        if is_dev?
            return "12345"
        end
        return encounter_billing&.interchange_number
    end

    def get_claim_charge_amount
        rollingTotal = 0
        encounter_claim_informations.each do |claim|
            rollingTotal += claim.units.to_i * claim.charges.to_f
        end
        return rollingTotal
    end

    def get_place_of_service_code
        return encounter_billing.customer.place_of_service_code
    end

    def get_claim_frequency
        # For now hardcoded to 1, refer to excel sheet
        return "1"
    end

    def get_signature_indicator
        # Hardcoded to 1, refer to excel sheet
        return "Y"
    end

    def get_plan_participation_code
        # Hardcoded to "A",refer to excel sheet
        return "A"
    end

    def get_baci
        # Hardcoded to Y, refer to excel sheet 
        return "Y"
    end

    def get_release_information_code
        # hardcoded to YY, refert to excel sheet
        return "Y"
    end

    def get_claim_service_date
        return encounter_billing&.day_of_encounter&.strftime("%Y%m%d")
    end

    def get_healthcare_code_info
        if is_dev?
            return [{
            diagnosisTypeCode: "BK",
            diagnosisCode: "496"
            }]
        end
        codes = []
        encounter_claim_informations.each do |claim|
            codes << {
                diagnosisTypeCode: is_dev? ? "BK" : "ABK", #hard cpded, refer to excel sheet
                diagnosisCode: claim.diagnosis_code_value
            }
        end
        return codes
    end

    def get_service_line_data
        line_data = []
        encounter_claim_informations.each do |claim|
            line_data << {
                serviceDate: get_claim_service_date,
                professionalService: {
                    procedureIdentifier: "HC", #hard coded, refer to excel sheet
                    lineItemChargeAmount: claim.charges,
                    procedureCode: get_diagosis_code_only(claim.cpt_code),
                    measurementUnit: "UN", #hard coded to UN
                    serviceUnitCount: claim.units&.to_i,
                    compositeDiagnosisCodePointers: {
                        diagnosisCodePointers: ["1"]
                    }
                }
            }
        end
        return line_data
    end

    def get_diagosis_code_only(procedure_code)
        if procedure_code.is_a?(Numeric)
            return procedure_code
        else
            find_code = procedure_code&.match(/\((\d+)\)/) #this returns match data class
            code = find_code[1]
            if code
                return code
            else
                return procedure_code
            end
        end
    end

end