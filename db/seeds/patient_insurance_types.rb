if PatientInsuranceType.count.zero?
    insurance_types = [
        "Medicare",
        "Medicaid",
        "TRICARE",
        "CHAMPUS",
        "CHAMPVA",
        "Group Health Plan",
        "FECA",
        "Black Lung",
        "Other"
    ]

    insurance_types.each_with_index do |insurance_type, index|
        PatientInsuranceType.create!(
            insurance_type: insurance_type,
            display_on_ui: true,
            sort_order: index + 1
        )
    end
end