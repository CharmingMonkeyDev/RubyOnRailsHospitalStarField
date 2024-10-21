if AssignedPathway.count.zero?
    patient = User.where(email: 'dev+star_patient@codelation.com').first
    AssignedPathway.create!(
        user: patient,
        name: "Test pathway 1",
        start_date: Date.today,
        action_pathway_id: ActionPathway.first.id,
    )

    patient = User.where(email: 'dev+star_patient2@codelation.com').first
    AssignedPathway.create!(
        user: patient,
        name: "Test pathway 2",
        start_date: Date.today,
        action_pathway_id:ActionPathway.second.id,
    )

    patient = User.where(email: 'dev+star_patient3@codelation.com').first
    AssignedPathway.create!(
        user: patient,
        name: "Test pathway 3",
        start_date: Date.today,
        action_pathway_id: ActionPathway.third.id,
    )

    patient = User.where(email: 'dev+star_patient4@codelation.com').first
    AssignedPathway.create!(
        user: patient,
        name: "Test pathway 4",
        start_date: Date.today,
        action_pathway_id: ActionPathway.fourth.id,
    )

end