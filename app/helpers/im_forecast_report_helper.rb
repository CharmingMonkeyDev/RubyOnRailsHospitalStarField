# frozen_string_literal: true

module ImForecastReportHelper
    def sanitize_string(input_string)
        unless input_string.present?
            return nil
        end
        input_string = input_string.to_s
        
        if input_string.include?(',') || input_string.include?('"') || input_string.include?("\n")
            input_string = input_string.gsub(',', '')
            return input_string
        else
            return input_string
        end
    end
end