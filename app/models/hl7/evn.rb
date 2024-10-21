# frozen_string_literal: true

# EVN Docu: https://hl7-definition.caristix.com/v2/HL7v2.5.1/Segments/EVN
module HL7
    class EVN
        attr_accessor :segment_name 
        attr_accessor :event_type_code
        attr_accessor :recorded_date_time
        attr_accessor :event_reason_code

        attr_reader :separator
        
        def initialize(attributes={})
            @attributes = attributes
            @segment_name = "EVN"
            @event_type_code = "A31"
            @recorded_date_time = Time.now.strftime("%Y%m%d%H%I%S")
            @event_reason_code = ""
            @separator = "|"
        end
        
        def get_segment
            evn = "#{segment_name}#{separator}"
            evn_1 = "#{event_type_code}#{separator}"
            evn_2 = "#{recorded_date_time}#{separator}"
            evn_3 = "#{separator}"
            evn_4 = "#{event_reason_code}#{separator}"
            
            return evn+evn_1+evn_2+evn_3+evn_4
        end
    end
end
    

