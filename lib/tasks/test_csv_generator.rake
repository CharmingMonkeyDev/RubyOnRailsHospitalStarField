require 'csv'
require 'faker'

namespace :test do
  task generate_csv: :environment do

        # Set the number of rows
        num_rows = 500

        # Specify the CSV file path
        csv_file_path = 'generated_data.csv'

        # Specify the CSV headers
        headers = [
        "first_name*", "middle_name", "last_name*", "birth_date*", "email_address", "Gender",
        "Mobile Phone Number", "Address", "City", "State", "Zip", "Insurance Type",
        "Insurance Plan or Program Name", "Insured's ID #", "Insured's First Name", "Insured's Last Name",
        "Insured's Date of Birth", "Insured's Address", "Insured's City", "Insured's State", "Insured's Zip",
        "Insured's Phone Number", "Patient Relationship to Insured"
        ]

        # Generate and write data to CSV
        CSV.open(csv_file_path, 'w', write_headers: true, headers: headers) do |csv|
            num_rows.times do
                csv << [
                Faker::Name.first_name,
                Faker::Name.middle_name,
                Faker::Name.last_name,
                Faker::Date.birthday(min_age: 18, max_age: 65).strftime('%Y%m%d'),
                Faker::Internet.email,
                Faker::Gender.binary_type,
                Faker::PhoneNumber.cell_phone,
                Faker::Address.street_address,
                Faker::Address.city,
                Faker::Address.state_abbr,
                Faker::Address.zip_code,
                Faker::Lorem.word,
                Faker::Lorem.words(number: 3).join(' '),
                Faker::Number.unique.number(digits: 8),
                Faker::Name.first_name,
                Faker::Name.last_name,
                Faker::Date.birthday(min_age: 18, max_age: 65).strftime('%Y%m%d'),
                Faker::Address.street_address,
                Faker::Address.city,
                Faker::Address.state_abbr,
                Faker::Address.zip_code,
                Faker::PhoneNumber.cell_phone,
                Faker::Lorem.word
                ]
            end
        end

        puts "CSV file generated successfully at #{csv_file_path}"

  end
end
