# X12 Specification https://x298-008020.x12.org/
# password is in 1pass
#  https://www.edination.com/edi-file-formats.html is 837P

require 'net/http'
class ProcessSendCharges
    def initialize(attributes)
        @attributes = attributes
        @encounter_billing_id = attributes[:encounter_billing_id]
    end

    def call
        result = process_billing_send_charges
        Result.new({fileName: get_file_name, content: result}, "X12 string generated", true)
    end

    private 

    attr_accessor :encounter_billing_id

    def get_file_name
        "#{Date.today.strftime("%Y%m%d")}-#{encounter_billing&.patient.name}-Claim.txt"
    end

    def encounter_billing
        @encounter_billing ||= EncounterBilling.find(encounter_billing_id)
    end

    def interchange_date_time
        @interchange_date_time ||= DateTime.now
    end

    def customer
        @customer ||= encounter_billing.customer
    end

    def process_billing_send_charges
        generate_x12_string
    end

    def generate_billing_x12
        {
            "SegmentDelimiter": "~",
            "DataElementDelimiter": "*",
            "ISA": get_isa,
            "Groups": [
                {
                    "GS": get_gs,
                    "Transactions": [
                        {
                            "ST": get_st,
                            "BHT": get_bht,
                            "NM1Loop": [
                                get_submitter_nm1,
                                get_receiver_nm1
                            ],
                            "HLLoop": [
                                get_provider_hl,
                                get_subscriber_hl,
                            ],
                            "SE": get_se,
                        }
                    ]
                }
            ],
            "GETrailers": [
                get_ge,
            ],
            "IEATrailers": [ get_iea,]
        }
    end

    def generate_x12_string
        x12_obj = generate_billing_x12
        uri = URI(ENV["ENINATION_API_X12_URL"])
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json', 'accept' => 'application/octet-stream', 'Ocp-Apim-Subscription-Key'=> ENV["EDINATION_API_KEY"])
        request.body = x12_obj.to_json
        result = http.request(request)
        result.body
    end

    def get_isa
        {
            "AuthorizationInformationQualifier_1": "00",
            "AuthorizationInformation_2": "",
            "SecurityInformationQualifier_3": "",
            "SecurityInformation_4": "",
            "SenderIDQualifier_5": "30",
            "InterchangeSenderID_6": get_interchange_sender_id,
            "ReceiverIDQualifier_7": "30",
            "InterchangeReceiverID_8": get_interchange_receiver_id,
            "InterchangeDate_9": get_yymmdd_date,
            "InterchangeTime_10": get_hhmm_time,
            "InterchangeControlStandardsIdentifier_11": "^",
            "InterchangeControlVersionNumber_12": "00501",
            "InterchangeControlNumber_13": get_interchange_number,
            "AcknowledgementRequested_14": "0",
            "UsageIndicator_15": ENV["INTERCHANGE_USE_INDICATOR"],
            "ComponentElementSeparator_16": ":"
        }
    end

    def get_gs
        {
            "CodeIdentifyingInformationType_1": "HC",
            "SenderIDCode_2": get_interchange_sender_id,
            "ReceiverIDCode_3": get_interchange_receiver_id,
            "Date_4": get_ccyymmdd_date,
            "Time_5": get_hhmm_time,  
            "GroupControlNumber_6": get_interchange_number,
            "TransactionTypeCode_7": "X",
            "VersionAndRelease_8": "005010X222A2"

        }
    end

    def get_st
        {
            "TransactionSetIdentifierCode_01": "837",
            "TransactionSetControlNumber_02": get_transaction_set_unique_number,
            "ImplementationConventionPreference_03": "005010X222A2"
        }
    end

    def get_bht
        {
            "HierarchicalStructureCode_01": "0019", #this is standard for sources of billing provider
            "TransactionSetPurposeCode_02": "00", #18 is for reissue
            "ReferenceIdentification_03": get_application_transaction_identifier, 
            "Date_04": get_ccyymmdd_date,
            "Time_05": get_hhmm_time,
            "TransactionTypeCode_06": "RP", #RP: encounter, CH: claim
        }
    end

    def get_se
        # this is end block of ST
        {
            "NumberofIncludedSegments_01": "41", #these are the number of segments between SE and ST
            "TransactionSetControlNumber_02": get_transaction_set_unique_number #transaction control number, same as in ST
        }
    end

    def get_ge
        {
            "NumberOfIncludedSets_1": get_transaction_set_count,
            "GroupControlNumber_2": get_interchange_number
        }
    end

    def get_iea
        {
            "NumberOfIncludedGroups_1": get_functional_group_count,
            "InterchangeControlNumber_2": get_interchange_number
        }
    end

    def get_submitter_nm1
        # this is 1000A loop submitter information
        # in 1000A PER is submitter contact information
        {
            "NM1": {
                "EntityIdentifierCode_01": "41", #41 is Loop 1000A value for submitter
                "EntityTypeQualifier_02": "1", #1 is Person, 2 is Organization
                "NameLastorOrganizationName_03":  get_submitter_organization_name,
                "IdentificationCodeQualifier_08": "46", # in 1000A loop 46 in EIN/FTIN code
                "IdentificationCode_09": get_submitter_identifier_code
            },
            "PER": [
                {
                    "ContactFunctionCode_01": "IC", #IC is contact information code
                    "Name_02": get_submitter_name,
                }
            ]
        }
    end

    def get_receiver_nm1
        #this is 1000B loop receiver information
        {
            "NM1": {
                "EntityIdentifierCode_01": "40", #40 is Loop 1000B value for receiver
                "EntityTypeQualifier_02": "2", #1 is Person, 2 is Organization
                "NameLastorOrganizationName_03":  get_receiver_organization_name,
                "IdentificationCodeQualifier_08": "46", # in 1000B loop 46 in EIN/FTIN code
                "IdentificationCode_09": get_receiver_identifier_code
            }
        }
    end

    def get_provider_hl
        # there are 3 types of HL Loops 2000A: Provider, 2000B: Subscriber, 2000C: Patient
        # PRV is Rendering provider information
        {
            "HL": {
                "HierarchicalIDNumber_01": "1", #this indicates first appearance
                # HL_02 in indicate to use parent which is not present here
                "HierarchicalLevelCode_03": "20", #20: provider, 22: subscriber and 23: patient
                "HierarchicalChildCode_04": "1" #meaning there is one more HL code
            },
            "PRV": {
                "ProviderCode_01": "BI", #BI:billing provider, PT: Pay-to-provider, there are other options too
                "ReferenceIdentificationQualifier_02": "PXC", #mutually defined taxonomy
                "ReferenceIdentification_03": get_transaction_set_indentifier
            },
            "NM1Loop": [
                # these NM1s have different codes than receiver and submitter NM1 because they are in 2000A loop
                {
                    "NM1": {
                      "EntityIdentifierCode_01": "85", #85 in 2000 loop indicate provider information
                      "EntityTypeQualifier_02": "2", #1 is Person, 2 is Organization
                      "NameLastorOrganizationName_03": get_submitter_name,
                      "IdentificationCodeQualifier_08": "XX", #XX indicate number provided by medicaid or medicare
                      "IdentificationCode_09": get_medicare_or_medicaid_provided_number
                    },
                    "N3": [
                      {
                        "AddressInformation_01": get_customer_address
                      }
                    ],
                     "N4": {
                      "CityName_01": get_customer_city,
                      "StateorProvinceCode_02": get_customer_state,
                      "PostalCode_03": get_customer_zip
                    },
                }
            ]
        }
    end

    def get_subscriber_hl
        # there are 3 types of HL Loops 2000A: Provider, 2000B: Subscriber, 2000C: Patient
        # this is subscriber HL
        {
            "HL": {
                "HierarchicalIDNumber_01": "2", #this indicates second appearance 
                "HierarchicalParentIDNumber_02": "1", #1 is parent of this HL loop
                "HierarchicalLevelCode_03": "22", #20: provider, 22: subscriber and 23: patient
                "HierarchicalChildCode_04": "0" #meaning there is no HL loop after this
            },
            #this si subscriber information section
            "SBR": {
                "PayerResponsibilitySequenceNumberCode_01": "P", #p: Primary, S:Secondary, T:Tertiary
                "IndividualRelationshipCode_02": "18", #18 is primary
                "ReferenceIdentification_03": "12312-A",
                "ClaimFilingIndicatorCode_09": "HM"
            },
            "NM1Loop": [
                # This is NM1 of subscriber loop of 2000C
                {
                    "NM1": {
                      "EntityIdentifierCode_01": "85", #85 in 2000 loop indicate provider information
                      "EntityTypeQualifier_02": "2", #1 is Person, 2 is Organization
                      "NameLastorOrganizationName_03": get_submitter_name,
                      "IdentificationCodeQualifier_08": "XX", #XX indicate number provided by medicaid or medicare
                      "IdentificationCode_09": get_medicare_or_medicaid_provided_number
                    },
                    "N3": [
                      {
                        "AddressInformation_01": get_customer_address
                      },
                    ],
                     "N4": {
                      "CityName_01": get_customer_city,
                      "StateorProvinceCode_02": get_customer_state,
                      "PostalCode_03": get_customer_zip
                    },
                }
            ]
        }
    end

    def get_yymmdd_date
        # should be on YYMMDD format
        interchange_date_time.strftime("%y%m%d")
    end

    def get_ccyymmdd_date
        # should be on YYMMDD format
        interchange_date_time.strftime("%Y%m%d")
    end

    def get_hhmm_time
        # should be on HHMM format
        interchange_date_time.strftime("%H%M")
    end

    def get_interchange_number
        encounter_billing&.interchange_number
    end

    def get_interchange_sender_id
        ENV["BILLING_INTERCHANGE_SENDER_ID"]
    end

    def get_interchange_receiver_id
        ENV["BILLING_INTERCHANGE_RECEIVER_ID"]
    end

    def get_transaction_set_count
        "1" 
        # this is count of total ST in X12
    end

    def get_functional_group_count
        "1"
        # this is count of GS segment in X12
    end

    def get_transaction_set_unique_number
        encounter_billing&.transaction_set_number
    end

    def get_application_transaction_identifier
        ENV["BUSINESS_APPLICATION_NUMBER"]
    end

    
    def get_submitter_organization_name
        encounter_billing.place_of_service
    end

    def get_submitter_name
        encounter_billing&.provider_name
    end

    def get_submitter_identifier_code
        encounter_billing&.created_by&.provider_npi_number
    end

    def get_receiver_organization_name
        ENV["BILLING_RECEIVING_ORG"]
    end

    def get_receiver_identifier_code
        ENV["BILLING_RECEIVER_IDENTIFIER_CODE"]
    end

    def get_transaction_set_indentifier
        "trans_set_identifier"
    end

    def get_medicare_or_medicaid_provided_number
        ENV["MEDICARE_OR_MEDICAID_PROVIDER_NUMBER"]
    end

    def get_customer_address
        customer&.address
    end

    def get_customer_city
        customer&.city
    end

    def get_customer_state
        customer&.state
    end

    def get_customer_zip
        customer&.zip
    end

    

    # Questions
    # 1. what is the sender if for ISA06
    # 2. what is receiver ID number ISA08
    # 3. What is application transaction identifier BHT03
    # 4. What is submittere EIN or FTIN number
    # 5. what is receiver name,  EIN or FTIN number
    # what is Medicare or Medicaid Services National Provider Identifier

end