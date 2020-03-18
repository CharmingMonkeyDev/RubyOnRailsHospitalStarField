module HL7
    class ParseFile
        def initialize(attributes)
            @attributes = attributes
            @file_content = @attributes[:file_content]
        end

        def call
            process_hl7_file
        end

        private

        attr_accessor :file_content

        def process_hl7_file
            content = clean_content_for_batch_ruby
            segments = split_by_delimeter(content, "\r")
            hl7_content = parse_segments(segments)
            hl7_content
        end

        def parse_segments(segments)
            main_hl7 = {}
            segments.each do |segment|
                elements = split_by_delimeter(segment, "|")
                segment_header = elements[0]
                segment_elements = elements[1..]
                if segment_header == "MSH"
                    main_hl7[segment_header] = parse_msh_header(segment_elements)
                else
                    main_hl7[segment_header&.strip] = parse_elements(segment_elements)
                end
            end
            main_hl7
        end

        def parse_msh_header(segment_elements)
            element_composition = {}
            element_composition["1"] = "|"
            element_composition["2"] = segment_elements[0]
            segment_elements[1..].each_with_index do |element, index|
                items = split_by_delimeter(element, "^")
                if items.length > 1
                    element_composition["#{index+3}"] = parse_items(items)
                else
                    element_composition["#{index+3}"] = element
                end
            end
            element_composition
        end

        def parse_elements(segment_elements)
            element_composition = {}
            segment_elements.each_with_index do |element, index|
                items = split_by_delimeter(element, "^")
                if items.length > 1
                    element_composition["#{index+1}"] = parse_items(items)
                else
                    element_composition["#{index+1}"] = element
                end
            end
            element_composition
        end

        def parse_items(items)
            item_composition = {}
            items.each_with_index do |item, index|
                item_composition["#{index+1}"] = item
            end
            item_composition
        end

        def clean_content_for_batch_ruby
            if file_content.include?("\n")
                content = file_content.gsub("\n", "\r")

                if content.include?("\r\r")
                    content = content.gsub("\r\r", "\r")
                end
                content
            else
                file_content
            end
        end

        def split_by_delimeter(content, delimeter)
            array_content = content.split(delimeter)

            # remove blanks if they are segement, keeping blanks for elements
            if delimeter == "\r"
                array_content&.reject(&:blank?)
            end
            array_content
        end

    end
end