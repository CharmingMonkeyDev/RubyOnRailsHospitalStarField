# frozen_string_literal: true

if Diagnosis.count.zero?
  Diagnosis.create!([
    { code: "A000", code_description: "Cholera due to Vibrio cholerae 01, biovar cholerae", source_type: "Added manually" },
    { code: "A001", code_description: "Cholera due to Vibrio cholerae 01, biovar eltor", source_type: "Added manually" },
    { code: "A009", code_description: "Cholera, unspecified", source_type: "Added manually" },
    { code: "A0100", code_description: "Typhoid fever, unspecified", source_type: "Added manually" },
    { code: "A0101", code_description: "Typhoid meningitis", source_type: "Added manually" },
    { code: "A0102", code_description: "Typhoid fever with heart involvement", source_type: "Added manually" },
    { code: "A0103", code_description: "Typhoid pneumonia", source_type: "Added manually" },
    { code: "A0104", code_description: "Typhoid arthritis", source_type: "Added manually" },
    { code: "A0105", code_description: "Typhoid osteomyelitis", source_type: "Added manually" },
    { code: "A0109", code_description: "Typhoid fever with other complications", source_type: "Added manually" }
  ])
end