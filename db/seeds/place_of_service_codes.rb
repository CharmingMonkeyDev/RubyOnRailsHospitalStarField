if PlaceOfServiceCode.count.zero?

  place_of_service_list = [
    { code: '01', name: 'Pharmacy' },
    { code: '02', name: "Telehealth Provided Other than in Patient's Home" },
    { code: '03', name: 'School' },
    { code: '04', name: 'Homeless Shelter' },
    { code: '05', name: 'Indian Health Service Free-standing Facility' },
    { code: '06', name: 'Indian Health Service Provider-based Facility' },
    { code: '07', name: 'Tribal 638 Free-standing Facility' },
    { code: '08', name: 'Tribal 638 Provider-based Facility' },
    { code: '09', name: 'Prison/Correctional Facility' },
    { code: '10', name: "Telehealth Provided in Patient's Home" },
    { code: '11', name: 'Office' },
    { code: '12', name: 'Home' },
    { code: '13', name: 'Assisted Living Facility' },
    { code: '14', name: 'Group Home' },
    { code: '15', name: 'Mobile Unit' },
    { code: '16', name: 'Temporary Lodging' },
    { code: '17', name: 'Walk-in Retail Health Clinic' },
    { code: '18', name: 'Place of Employment-Worksite' },
    { code: '19', name: 'Off Campus-Outpatient Hospital' },
    { code: '20', name: 'Urgent Care Facility' },
    { code: '21', name: 'Inpatient Hospital' },
    { code: '22', name: 'On Campus-Outpatient Hospital' },
    { code: '23', name: 'Emergency Room - Hospital' },
    { code: '24', name: 'Ambulatory Surgical Center' },
    { code: '25', name: 'Birthing Center' },
    { code: '26', name: 'Military Treatment Facility' },
    { code: '27', name: 'Outreach Site/ Street' },
    { code: '31', name: 'Skilled Nursing Facility' },
    { code: '32', name: 'Nursing Facility' },
    { code: '33', name: 'Custodial Care Facility' },
    { code: '34', name: 'Hospice' },
    { code: '41', name: 'Ambulance - Land' },
    { code: '42', name: 'Ambulance - Air or Water' },
    { code: '49', name: 'Independent Clinic' },
    { code: '50', name: 'Federally Qualified Health Center' },
    { code: '51', name: 'Inpatient Psychiatric Facility' },
    { code: '52', name: 'Psychiatric Facility-Partial Hospitalization' },
    { code: '53', name: 'Community Mental Health Center' },
    { code: '54', name: 'Intermediate Care Facility/ Individuals with Intellectual Disabilities' },
    { code: '55', name: 'Residential Substance Abuse Treatment Facility' },
    { code: '56', name: 'Psychiatric Residential Treatment Center' },
    { code: '57', name: 'Non-residential Substance Abuse Treatment Facility' },
    { code: '58', name: 'Non-residential Opioid Treatment Facility' },
    { code: '60', name: 'Mass Immunization Center' },
    { code: '61', name: 'Comprehensive Inpatient Rehabilitation Facility' },
    { code: '62', name: 'Comprehensive Outpatient Rehabilitation Facility' },
    { code: '65', name: 'End-Stage Renal Disease Treatment Facility' },
    { code: '66', name: 'Programs of All-Inclusive Care for the Elderly (PACE) Center' },
    { code: '71', name: 'Public Health Clinic' },
    { code: '72', name: 'Rural Health Clinic' },
    { code: '81', name: 'Independent Laboratory' },
    { code: '99', name: 'Other Place of Service' }
  ]
  
  place_of_service_list.each do |place_of_service|
    PlaceOfServiceCode.create!(
        name: place_of_service[:name],
        code: place_of_service[:code]
      )
  end
end