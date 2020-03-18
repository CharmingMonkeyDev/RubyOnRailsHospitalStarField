if ActionPathway.count.zero?
    patient = User.where(email: 'dev+star_patient@codelation.com').first
    ActionPathway.create!(
        customer_id: Customer.first.id,
        name: "Test pathway 1",
    )

    patient = User.where(email: 'dev+star_patient2@codelation.com').first
    ActionPathway.create!(
        customer_id: Customer.second.id,
        name: "Test pathway 2",
    )

    patient = User.where(email: 'dev+star_patient3@codelation.com').first
    ActionPathway.create!(
        customer_id: Customer.first.id,
        name: "Test pathway 3",
    )

    patient = User.where(email: 'dev+star_patient4@codelation.com').first
    ActionPathway.create!(
      customer_id: Customer.first.id,
      name: "Test pathway 4",
    )

end