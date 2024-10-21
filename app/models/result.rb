class Result
    attr_reader :resource, :message, :success
    def initialize(resource, message, success)
        @resource = resource
        @message = message
        @error = message
        @success = success
    end

    def success?
        @success
    end

    def error
        @message
    end
end 