if Customer.count.zero?
    Customer.create!(
        name: "Starfield Central",
        address: "1641 Capitol Way",
        city: "Bismarck",
        state: "ND",
        zip: "58501",
        notes: "First Clinic",
        federal_tax_id: rand.to_s[2..11],
        facility_npi: rand.to_s[2..11] 
    )

    Customer.create!(
        name: "Johnson Pharm",
        address: "1641 Capitol Way",
        city: "Bismarck",
        state: "ND",
        zip: "58501",
        notes: "Second Pharm",
        federal_tax_id: rand.to_s[2..11],
        facility_npi: rand.to_s[2..11] 
    )

    Customer.create!(
        name: "Capital Pharmacy",
        address: "1641 Capitol Way",
        city: "Bismarck",
        state: "ND",
        zip: "58501",
        notes: "Third Pharm",
        federal_tax_id: rand.to_s[2..11],
        facility_npi: rand.to_s[2..11] 
    )

    Customer.create!(
        name: "Another Pharmacy",
        address: "1641 Capitol Way",
        city: "Bismarck",
        state: "ND",
        zip: "58501",
        notes: "Another Pharm",
        federal_tax_id: rand.to_s[2..11],
        facility_npi: rand.to_s[2..11] 
    )

    Customer.all.each do |customer|
        Privilege.all.each do |privilege|
            default_pharmacist = nil
            default_physician = nil
            default_coach = nil
            default_patient = nil
            if privilege.name == "Invite New Patient"
                default_pharmacist = true
                default_physician = false
                default_coach = false
                default_patient = false
            end
            if privilege.name == "Edit Patient"
                default_pharmacist = true
                default_physician = true
                default_coach = true
                default_patient = true
            end
            if privilege.name == "Add Customer Association"
                default_pharmacist = true
                default_physician = false
                default_coach = false
                default_patient = false
            end
            if privilege.name == "View Customers"
                default_pharmacist = true
                default_physician = true
                default_coach = false
                default_patient = false
            end
            if privilege.name == "View Patient Labs"
                default_pharmacist = true
                default_physician = true
                default_coach = false
                default_patient = true
            end
            if privilege.name == "Update Privileges"
                default_pharmacist = true
                default_physician = false
                default_coach = false
                default_patient = false
            end
            if privilege.name == "Access Care Plan Builder"
                default_pharmacist = true
                default_physician = true
                default_coach = true
                default_patient = false
            end
            if privilege.name == "Access Resource Catalog"
                default_pharmacist = true
                default_physician = true
                default_coach = true
                default_patient = true
            end
            CustomerDefaultPrivilege.create(
                customer_id: customer.id,
                privilege_id: privilege.id,
                default_pharmacist: default_pharmacist,
                default_physician: default_physician,
                default_coach: default_coach,
                default_patient: default_patient
            )
        end
    end
end