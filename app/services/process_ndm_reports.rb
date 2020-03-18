class ProcessNdmReports
    def initialize(attributes)
        @attributes = attributes
        @ndm_report_id = @attributes[:ndm_report_id]
        @ndm_providers_file = @attributes[:ndm_providers_file]
        @patient_eligibility_file = @attributes[:patient_eligibility_file]
        @drug_claim_file = @attributes[:drug_claim_file]
        @medical_claim_file = @attributes[:medical_claim_file]
    end

    def call
        process_reports
        result = Result.new({
            errors: errors,
            records_processed: @records_processed,
            records_uploaded: @records_uploaded,
            records_failed: @records_failed
        }, "File Processed", true)
    end

    private
    
    attr_accessor :ndm_report_id, :errors, :ndm_providers_file, :patient_eligibility_file, :drug_claim_file, :medical_claim_file

    def process_reports
        url = URI("#{ENV["NDM_REPORTING_APP_URL"]}/process-reports")
        token = ReportingApiAuth.generate_token
        http = Net::HTTP.new(url.host, url.port)
        if url.scheme == "https"
            http.use_ssl = true
            http.verify_mode = OpenSSL::SSL::VERIFY_PEER
        end
        request = Net::HTTP::Post.new(url)
        request['Authorization'] = "Bearer #{token}"
        request['Content-Type'] = 'application/json'
        request['Accept'] = 'application/json'

        data = {
            ndm_report_id: @ndm_report_id,
            ndm_providers_file: @ndm_providers_file,
            patient_eligibility_file: @patient_eligibility_file,
            drug_claim_file: @drug_claim_file,
            medical_claim_file: @medical_claim_file
        }
        request.body = data.to_json

        result = http.request(request)
        if result.code.to_i == 401
            NdmReport.find(@ndm_report_id).update(status: "invalid", issues: [{ param: "authentication error", reason:  "Authentication to reporting app failed." }])
        end
    rescue StandardError => e
        NdmReport.find(@ndm_report_id).update(status: "invalid", issues: [{ param: "Server Error", reason:  "Reporting app offline." }])
    end
end