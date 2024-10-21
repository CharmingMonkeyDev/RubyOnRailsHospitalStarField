# frozen_string_literal: true

# MSH Docu: https://hl7-definition.caristix.com/v2/HL7v2.5.1/Segments/MSH
module HL7
    class MSH
        attr_accessor :segment_name 
        attr_accessor :encoding_character
        attr_accessor :sending_application
        attr_accessor :sending_facility
        attr_accessor :receiving_application
        attr_accessor :receiving_facility
        attr_accessor :date_time_of_message
        attr_accessor :message_type
        attr_accessor :message_control_id
        attr_accessor :processing_id
        attr_accessor :version_id

        attr_reader :separator
        
        def initialize(attributes={})
            @attributes = attributes
            @segment_name = "MSH"
            @encoding_character = '^~\&'
            @sending_application = "STARFIELD"
            @sending_facility = "STAR^STAR"
            @receiving_application = "RHAPSODY"
            @receiving_facility = "NDHIN"
            @date_time_of_message = Time.now.strftime("%Y%m%d%H%I%S")
            @message_type = "ADT^A31"
            @message_control_id = ""
            @processing_id = Rails.env.development? ? "T" : "P"
            @version_id = "2.5.1"

            @separator = "|"
        end
        
        def get_segment
            msh_1 = "#{segment_name}#{separator}"
            msh_2 = "#{encoding_character}#{separator}"
            msh_3 = "#{sending_application}#{separator}"
            msh_4 = "#{sending_facility}#{separator}"
            msh_5 = "#{receiving_application}#{separator}"
            msh_6 = "#{receiving_facility}#{separator}"
            msh_7 = "#{date_time_of_message}#{separator}"
            msh_8 = "#{separator}"
            msh_9 = "#{message_type}#{separator}"
            msh_10 = "#{message_control_id}#{separator}"
            msh_11 = "#{processing_id}#{separator}"
            msh_12 = "#{version_id}"
            
            return msh_1+msh_2+msh_3+msh_4+msh_5+msh_6+msh_7+msh_8+msh_9+msh_10+msh_11+msh_12
        end
    end
end
    

