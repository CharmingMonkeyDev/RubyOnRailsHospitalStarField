class ProcessPatientUpload
    def initialize(attributes)
        @attributes = attributes
        @file = @attributes[:file]
        @invited_by_id = @attributes[:invited_by_id]
        @errors = []
        @records_processed = 0
        @records_uploaded = 0
        @records_failed = 0
    end

    def call
        process_patient_upload
        result = Result.new({
            errors: errors,
            records_processed: @records_processed,
            records_uploaded: @records_uploaded,
            records_failed: @records_failed
        },"File Processed", true)
    end

    private
    
    attr_accessor :file, :errors, :invited_by_id

    # process functions
    def process_patient_upload
        valid_header = validate_headers
        if valid_header
            upload_patients
        else
            errors.push({message: "Invalid file headers", row: []})
        end
    end

    def upload_patients
        csv_rows = CSV.parse(File.read(file), headers: true)
        csv_rows.each do |row|
            row_error = false
            user = nil
            @records_processed += 1
            # csv items for users
            first_name = row.dig("first_name*")
            middle_name = row.dig("middle_name")
            last_name = row.dig("last_name*")
            raw_birth_date = row.dig("birth_date*") #format is YYYYMMDD
            date_of_birth = format_date(raw_birth_date)
            email = row.dig("email_address")
            gender = row.dig("Gender")
            mobile_phone_number = row.dig("Mobile Phone Number")
            address = row.dig("Address")
            city = row.dig("City")
            state = row.dig("State")
            zip = row.dig("Zip")

            unless validate_text_field(first_name)
                errors.push({message: "Invalid First Name", row: row})
                row_error = true
            end

            unless validate_text_field(last_name)
                errors.push({message: "Invalid Last Name", row: row})
                row_error = true
            end

            unless valid_date(raw_birth_date) && raw_birth_date.length == 8
                errors.push({message: 'Invalid Birth Date', row: row})
                row_error = true
            end

            if row_error
                @records_failed += 1
                next
            else
                if user_exits?(first_name, last_name, date_of_birth)
                    errors.push({message: 'User already exits', row: row})
                    row_error = true
                    @records_failed += 1
                    next
                end

                if user_exits_with_email?(email)
                    errors.push({message: 'User already exits with this email', row: row})
                    row_error = true
                    @records_failed += 1
                    next
                end

                unless validate_text_field(email)
                    # we are letting provider to create user without email
                    # we would be assigning email 
                    dummy_email = DummyEmail.new().get_email
                    email = dummy_email
                end
                result = ProcessPatientCreation.new({
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    email: email,
                    date_of_birth: date_of_birth,
                    invited_by_id: invited_by_id,
                    user_creation_type: "not_invited",
                    mobile_phone_number: mobile_phone_number,
                    gender: gender,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip
                }).call
                resource = result.resource
                if resource && result.success?
                    user = resource
                    @records_uploaded += 1
                else
                    errors.push({message: "User cannot be created. #{result.message}", row: row})
                    @records_failed += 1
                    next
                end
            end
            if user
                process_insurance_creation(user, row)
            end
        end
    end

    def process_insurance_creation(user, row)
        insurance_type = row.dig("Insurance Type")
        plan_name = row.dig("Insurance Plan or Program Name")
        insured_id = row.dig("Insured's ID #")
        insured_first_name = row.dig("Insured's First Name")
        insured_last_name = row.dig("Insured's Last Name")
        insured_dob = row.dig("Insured's Date of Birth")
        address = row.dig("Insured's Address")
        city = row.dig("Insured's City")
        state = row.dig("Insured's State")
        zip = row.dig("Insured's Zip")
        phone_number = row.dig("Insured's Phone Number")
        relationship = row.dig("Patient Relationship to Insured")
        if insurance_type.present? && plan_name.present? && insured_id.present? && relationship.present?
            begin
                PatientInsurance.create!(
                    user_id: user.id,
                    insurance_type: insurance_type,
                    plan_name: plan_name,
                    insured_id: insured_id, 
                    insured_name: "#{insured_first_name} #{insured_last_name}",
                    insured_dob: insured_dob,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                    phone_number: phone_number,
                    relationship: relationship
                )
            rescue StandardError => e
                Rollbar.warning("Error: #{e} --process_patient_upload#process_insurance_creation")
                errors.push({message: 'User created. Insurance cannot be created', row: row})
            end
        else
            errors.push({message: 'User created. Incomplete insurance information.', row: row})
        end
    end

    # validation functions
    def validate_headers
         expected_headers = [
            "first_name*", 
            "middle_name",
            "last_name*",
            "birth_date*",
            "email_address",
            "Gender",
            "Mobile Phone Number",
            "Address",
            "City",
            "State",
            "Zip",
            "Insurance Type",
            "Insurance Plan or Program Name",
            "Insured's ID #",
            "Insured's First Name",
            "Insured's Last Name",
            "Insured's Date of Birth",
            "Insured's Address",
            "Insured's City",
            "Insured's State",
            "Insured's Zip",
            "Insured's Phone Number",
            "Patient Relationship to Insured"
        ]
        actual_headers = CSV.parse(File.read(file), headers: true).headers
        if actual_headers == expected_headers
            return true
        else
            return false
        end
    end

    def user_exits?(first_name, last_name, date_of_birth)
        user = User.where("LOWER(first_name) = ? AND LOWER(last_name) = ? AND date_of_birth = ?", first_name&.downcase, last_name&.downcase, date_of_birth).first
        if user
            return true
        else
            return false
        end
    end

    def user_exits_with_email?(email)
        user = User.find_by_email(email)
        if user
            return true
        else
            return false
        end
    end

    def validate_text_field(text)
        text.present? && text.length.positive?
    end

    def valid_date(date)
        date_object = DateTime.parse(date)
        true
    rescue StandardError => e
        false
    end

    # helper functions
    def sanitize_field(field)
        unless field.nil?
            field.gsub!(/^\"|\"?$/, '').gsub!(/^\'|\'?$/, '')
        else
            field 
        end
    end

    def format_date(date)
        # we are expecting YYYYMMDD format
        parsed_date = DateTime.parse(date)
        formatted_date = parsed_date.strftime("%Y-%m-%d")
       return formatted_date
    rescue StandardError => e
        return ""
    end
    
end