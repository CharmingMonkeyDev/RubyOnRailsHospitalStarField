# Docs: https://rest.textmagic.com/api/v2/doc/#operations-tag-Messages\:_Send
class TextSms
    attr_accessor :phone_number, :message
    def initialize(phone_number, message)
        @phone_number = phone_number
        @message = message
    end

    def send
        send_message
    end

    private

    def phone
        @phone ||= sanitize_phone_number
    end

    def send_message
        if phone
            begin
                url = URI.parse('https://rest.textmagic.com/api/v2/messages')
                http = Net::HTTP.new(url.host, url.port)
                http.use_ssl = true
                request = Net::HTTP::Post.new(url.path)

                # headers
                request['accept'] = '*/*'
                request['X-TM-Key'] = ENV["TEXT_MAGIC_API_KEY"]
                request['X-TM-Username'] = ENV["TEXT_MAGIC_USERNAME"]
                request['Content-Type'] = 'application/json'

                # body
                request_body = {
                    "text": message,
                    "phones": phone #need to remove - and add 1 at the begining
                }
                request.body = request_body.to_json
                response = http.request(request)
                if response.code.to_i
                    Result.new(nil, "Successfully sent", true)
                else
                    Result.new(response, "Cannot send text", false)
                end
            rescue StandardError => e
                Rollbar.warning("Error: #{e} --process_ndiis_link::link_with_ndiis")
                return Result.new(nil, e, false)
            end
        else
            return Result.new(nil, "Invalid Phone Number", false)
        end
    end

    def sanitize_phone_number
        # assuming phone number comes on "XXX-XXX-XXXX" format
        sanitized_number = phone_number.gsub('-', '')

        if sanitized_number.match?(/^\d{10}$/)
            return "1#{sanitized_number}"
        else
            return nil
        end
    end
end