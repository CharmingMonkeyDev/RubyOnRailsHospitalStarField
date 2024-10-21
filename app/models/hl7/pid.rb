# frozen_string_literal: true

# MSH Docu: https://hl7-definition.caristix.com/v2/HL7v2.5.1/Segments/MSH
module HL7
    class PID
        attr_accessor :segment_name 
        attr_accessor :patient_identifier
        attr_accessor :patient_name
        attr_accessor :patient_dob
        attr_accessor :patient_sex
        attr_accessor :patient_address
        attr_accessor :patient_phone_number

        attr_reader :separator
        
        def initialize(attributes={})
            @attributes = attributes
            @segment_name = "PID"
            @patient_name = ""
            @patient_identifier = ""
            @patient_dob = ""
            @patient_sex = ""
            @patient_address = ""
            @patient_phone_number = "2187906564"

            @separator = "|"
        end
        
        def get_segment
            pid = "#{segment_name}#{separator}"
            pid_1 = "#{separator}"
            pid_2 = "#{separator}"
            pid_3 = "#{patient_identifier}#{separator}"
            pid_4 = "#{separator}"
            pid_5 = "#{patient_name}#{separator}"
            pid_6 = "#{separator}"
            pid_7 = "#{patient_dob}#{separator}"
            pid_8 = "#{patient_sex}#{separator}"
            pid_9 = "#{separator}"
            pid_10 = "#{separator}"
            pid_11 = "#{patient_address}#{separator}"
            pid_12 = "#{separator}"
            pid_13 = "#{patient_phone_number}#{separator}"
            
            return pid+pid_1+pid_2+pid_3+pid_4+pid_5+pid_6+pid_7+pid_8+pid_9+pid_10+pid_11+pid_12+pid_13
        end
    end
end
    

