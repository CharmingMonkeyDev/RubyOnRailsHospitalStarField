# frozen_string_literal: true

module PatientUploadHelper
  def upload_data(file, customer_id)
    errors = []
    records_uploaded = 0
    records_failed = 0

    csv_rows = CSV.read(file)
    csv_rows.each do |row|
      if row[0] != "first_name"
        if row.length == 5
          row_error = false
          first_name = sanitize_field(row[0])
          middle_name = sanitize_field(row[1])
          last_name = sanitize_field(row[2])
          birth_date = sanitize_field(row[3])
          email_address = sanitize_field(row[4])

          unless valid_text_field(first_name)
            errors.push({message: 'Invalid First Name', row: row})
            row_error = true
          end
          unless valid_text_field(last_name)
            errors.push({message: 'Invalid Last Name', row: row})
            row_error = true
          end
          unless valid_date(birth_date) && birth_date.length == 8
            errors.push({message: 'Invalid Birth Date', row: row})
            row_error = true
          end
          unless email_address =~ URI::MailTo::EMAIL_REGEXP
            errors.push({message: 'Invalid Email Address', row: row})
            row_error = true
          end

          unless row_error
            begin
              user = User.create!(
                role: 'patient',
                name: "#{first_name}#{middle_name && middle_name.length.positive? ? " #{middle_name}" : ''} #{last_name}", 
                date_of_birth: DateTime.parse(birth_date + " 12:00:00.000000"), 
                email: email_address,
                customer_id: customer_id,
                invite_token: Digest::SHA1.hexdigest(email_address),
                password: Digest::SHA1.hexdigest(email_address),
              )

              InvitePatientMailer.invite_patient(user).deliver
              records_uploaded +=1
            rescue StandardError => e
              errors.push({ message: e, row: row })
              records_failed +=1
            end
          else 
            records_failed +=1
          end

        else
          errors.push({ message: 'This row does not match the valid csv format.', row: row })
          records_failed +=1
        end
      end
    end

    return errors, (csv_rows.length - 1), records_uploaded, records_failed
  end

  def sanitize_field(field)
    unless field.nil?
      field.gsub!(/^\"|\"?$/, '').gsub!(/^\'|\'?$/, '')
    else
      field 
    end
  end

  def valid_text_field(field)
    (field.present? && field.length.positive?)
  end

  def valid_date(field)
    date_object = DateTime.parse(field)
    true
  rescue StandardError => e
    false
  end
end
