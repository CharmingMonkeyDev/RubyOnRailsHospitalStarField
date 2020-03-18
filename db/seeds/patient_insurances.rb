if PatientInsurance.count.zero?
    # only creating record for 4 patients so that some will be without records
    patients = User.where(role: "patient").order(:id).limit(4)

    patients.each do |patient|
        random = rand(0..PatientInsurance.relationships.length - 1)
        insurance_types = PatientInsuranceType.all.pluck(:insurance_type)
        insurance_type = insurance_types.sample
        relationship = PatientInsurance.relationships.flatten.uniq[random]
        PatientInsurance.create!(
            user: patient,
            relationship: relationship,
            insurance_type: insurance_type,
            insured_id: Faker::Alphanumeric.alphanumeric(number: 10, min_alpha: 3, min_numeric: 7),
            insured_name: patient.name,
            insured_dob: patient.date_of_birth,
            plan_name: Faker::Alphanumeric.alphanumeric(number: 10, min_alpha: 3, min_numeric: 7),
            address: Faker::Address.street_address,
            city: Faker::Address.street_address,
            state: Faker::Address.state_abbr,
            zip: Faker::Address.zip
        )
    end
end