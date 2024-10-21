def create_notes(eb)
    pharmacist = User.where(email: "dev+star_pharmacist@codelation.com").first
    en = EncounterNote.create!(
        encounter_billing_id: eb.id,
        creator_id: pharmacist.id
    )
    EncounterNoteBlock.create!(note: "These are my notes", order:1, encounter_note_id: en.id)
end 

if EncounterBilling.count.zero?
    patient = User.where(email: "dev+star_patient@codelation.com").first
    pharmacist = User.where(email: "dev+star_pharmacist@codelation.com").first

    eb = patient.encounter_billings.create!(
        patient_id: patient.id,
        encounter_type: "documentation",
        day_of_encounter: Date.today,
        place_of_service: "Starfield Central",
        status: "pended",
        generate_claim: false,
        provider_name: "Suman Koirala"
    )
    create_notes(eb)
    
    eb = patient.encounter_billings.create!(
        patient_id: patient.id,
        encounter_type: "office_visit",
        day_of_encounter: Date.yesterday,
        place_of_service: "Starfield Central",
        status: "pended",
        generate_claim: false,
        provider_name: "Suman Koirala"
    )
    create_notes(eb)
    
    eb = patient.encounter_billings.create!(
        patient_id: patient.id,
        encounter_type: "documentation",
        day_of_encounter: Date.today,
        place_of_service: "Starfield Central",
        status: "signed",
        generate_claim: false,
        provider_name: "Suman Koirala"
    )
    create_notes(eb)

    eb = patient.encounter_billings.create!(
        patient_id: patient.id,
        encounter_type: "phone_call",
        day_of_encounter: Date.yesterday,
        place_of_service: "Starfield Central",
        status: "signed",
        generate_claim: false,
        provider_name: "Suman Koirala"
    )
    create_notes(eb)
end