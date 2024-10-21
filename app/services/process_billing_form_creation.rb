class ProcessBillingFormCreation
    def initialize(attributes)
        @attributes = attributes
        @encounter_billing_id = attributes[:encounter_billing_id]
        @encounter_type = attributes[:encounter_type]
        @generate_claim = attributes[:generate_claim]
        @day_of_encounter = Date.parse(attributes[:day_of_encounter])
        @place_of_service = attributes[:place_of_service]
        @patient_id = attributes[:patient_id]
        @status = attributes[:status]
        @blocks = attributes[:blocks]
        @instruction_blocks = attributes[:instruction_blocks]
        @provider_name = attributes[:provider_name]
        @created_by_id = attributes[:created_by_id]

        # claim information object, will only present on claim generating billing, structure is on encounters_controller
        @claim_information_object = attributes[:claim_information_object]
        @rendering_provider = attributes[:rendering_provider]

        # for insurance_object data structure, checkout encounters_controller
        @insurance_object = attributes[:insurance_object]

        # for insurance_object data structure, checkout encounters_controller
        @billing_1500_obj = attributes[:billing_1500_obj]
    end

    def call
        billing = process_billing_form
        if billing
            Result.new(billing, "Encounter Billing #{status&.titleize}", true)
        else
            Result.new(nil, "Encounter Billing Cannot Be Changed", false)
        end
    end

    private

    attr_accessor :encounter_billing_id, :encounter_type, :generate_claim, :day_of_encounter, :place_of_service, :patient_id, :status, :blocks, :instruction_blocks, :provider_name, :created_by_id, :claim_information_object, :insurance_object, :billing_1500_obj, :rendering_provider

    def encounter_billing
        @encounter_billing = EncounterBilling.find(encounter_billing_id)
    end
    
    def process_billing_form
        billing_creation = create_encounter_billing
        billing = billing_creation[:billing]
        action = billing_creation[:action]
        create_notes(billing)
        if generate_claim
            create_claim_informations(billing)
            create_encounter_insurance(billing)
            create_billing_1500(billing)
        end
        create_logs(billing, action)
        billing
    end

    def create_encounter_billing
        if encounter_billing_id.present? && EncounterBilling.exists?(encounter_billing_id)
            billing = update_existing_encounter_billing
            action = status #either pended or signed
        else
            billing = create_new_encounter_billing
            action = "created"
        end
        {
            billing: billing,
            action: action
        } 
    end

    def create_notes(billing)
        unless encounter_billing_id.present? 
            en = EncounterNote.create!(
                encounter_billing_id: billing.id,
                creator_id: created_by_id
            )
            blocks.each_with_index do |block, i| 
              EncounterNoteBlock.create!(note: block[:note], order:block[:order], encounter_note_id: en.id)
            end
            
            instruction = PatientInstruction.create!(
              encounter_billing_id: billing.id,
              creator_id: created_by_id, 
            )

            instruction_blocks.each_with_index do |block, i|
              InstructionBlock.create!(note: block[:note], order:block[:order], patient_instruction_id: instruction.id)
            end
        else
            eb = EncounterBilling.find(encounter_billing_id)
            en = eb.regular_notes.first
            en&.blocks&.destroy_all
            blocks.each_with_index do |block, i|
              EncounterNoteBlock.create!(note: block[:note], order:block[:order], encounter_note_id: en.id)
            end

            instruction = eb.patient_instruction
            unless instruction 
              instruction = PatientInstruction.create!(
                encounter_billing_id: eb.id,
                creator_id: created_by_id, 
              )
            end
            instruction.blocks&.destroy_all
            instruction_blocks.each_with_index do |block, i|
              InstructionBlock.create!(note: block[:note], order:block[:order], patient_instruction_id: instruction.id)
            end
        end
    end

    def create_logs(billing, action)
        EncounterBillingLogger.create!(
            encounter_billing_id: billing.id,
            user_id: created_by_id,
            name: provider_name,
            action: action
        )
    end

    def create_new_encounter_billing
        billing = EncounterBilling.create!(
            encounter_type: encounter_type,
            generate_claim: generate_claim,
            day_of_encounter: day_of_encounter,
            place_of_service: place_of_service,
            patient_id: patient_id,
            status: status,
            provider_name: provider_name,
            created_by_id: created_by_id,
            rendering_provider: rendering_provider,
            customer_id: get_customer_id
        )
        billing
    end

    def update_existing_encounter_billing
        encounter_billing.update!(
            encounter_type: encounter_type,
            generate_claim: generate_claim,
            day_of_encounter: day_of_encounter,
            place_of_service: place_of_service,
            status: status,
            rendering_provider: rendering_provider,
        )
        encounter_billing
    end

    def create_claim_informations(billing)
        old_claim_ids = billing.encounter_claim_informations&.pluck(:id)
        new_claim_ids = claim_information_object.map{|c| c[:id]}.compact 
        
        # Handle adding codes
        claim_information_object.each do |claim_obj|
            if billing.encounter_claim_informations.find_by_id(claim_obj[:id])
              encounter_claim_information = billing.encounter_claim_informations.find_by_id(claim_obj[:id])
              encounter_claim_information.update!(
                encounter_billing_id: billing.id,
                cpt_code: claim_obj[:cptCode],
                diagnosis_code_value: claim_obj[:diagnosisCode]&.first,
                diagnosis_code_desc: claim_obj[:diagnosisCode]&.last,
                units: claim_obj[:units],
                charges: claim_obj[:charges],
                is_manual_cpt_code: claim_obj[:isManualCptCode],
                modifier: claim_obj[:showModifier] ? claim_obj[:modifier] : "",
              )
            else 
              EncounterClaimInformation.create(
                encounter_billing_id: billing.id,
                cpt_code: claim_obj[:cptCode],
                diagnosis_code_value: claim_obj[:diagnosisCode]&.first,
                diagnosis_code_desc: claim_obj[:diagnosisCode]&.last,
                units: claim_obj[:units],
                charges: claim_obj[:charges],
                is_manual_cpt_code: claim_obj[:isManualCptCode],
                modifier: claim_obj[:showModifier] ? claim_obj[:modifier] : "",
              )
              EncounterBillingLogger.create!(
                encounter_billing_id: billing.id,
                user_id: created_by_id,
                name: provider_name,
                action: "code_added"
              )
            end
        end
        # Handle removing codes
        old_claim_ids.each do |old_id|
          if !old_id.in? new_claim_ids
            billing.encounter_claim_informations.find_by_id(old_id).destroy
            EncounterBillingLogger.create!(
              encounter_billing_id: billing.id,
              user_id: created_by_id,
              name: provider_name,
              action: "code_removed"
            )
          end 
        end 
    end

    def create_encounter_insurance(billing)
        eb_info = billing.encounter_insurance_information
        if eb_info.present?
            eb_info.update(
                encounter_billing_id: billing.id,
                service_partner_id: insurance_object[:service_partner_id],
                claim_filing_code: insurance_object[:claim_filing_code],
                insurance_type: insurance_object[:insurance_type],
                plan_name: insurance_object[:plan_name],
                insured_id: insurance_object[:insured_id],
                relationship: insurance_object[:relationship],
                insured_name: insurance_object[:insured_name],
                insured_dob: insurance_object[:insured_dob],
                address: insurance_object[:address],
                city: insurance_object[:city],
                state: insurance_object[:state],
                zip: insurance_object[:zip],
                insured_phone_number: insurance_object[:insured_phone_number],
                feca_number: insurance_object[:feca_number],
                insured_sex: insurance_object[:insured_sex],
                other_claim_id: insurance_object[:other_claim_id],
                medicare_plan_name: insurance_object[:medicare_plan_name],
                another_benefit_plan_present: insurance_object[:another_benefit_plan_present],
            )
        else
            EncounterInsuranceInformation.create(
                encounter_billing_id: billing.id,
                insurance_type: insurance_object[:insurance_type],
                plan_name: insurance_object[:plan_name],
                insured_id: insurance_object[:insured_id],
                relationship: insurance_object[:relationship],
                insured_name: insurance_object[:insured_name],
                insured_dob: insurance_object[:insured_dob],
                address: insurance_object[:address],
                city: insurance_object[:city],
                state: insurance_object[:state],
                zip: insurance_object[:zip],
                insured_phone_number: insurance_object[:insured_phone_number],
                feca_number: insurance_object[:feca_number],
                insured_sex: insurance_object[:insured_sex],
                other_claim_id: insurance_object[:other_claim_id],
                medicare_plan_name: insurance_object[:medicare_plan_name],
                another_benefit_plan_present: insurance_object[:another_benefit_plan_present],
            )
        end
    end

    def create_billing_1500(billing)
        if billing_1500_obj
            billing_1500 = billing.encounter1500_information
            if billing_1500.present?
                billing_1500.update(
                    billing_1500_obj
                )
            else
                Encounter1500Information.create(billing_1500_obj.merge(encounter_billing_id: billing.id))
            end
        end
    end

    def get_customer_id
        provider = User.find(created_by_id)
        provider&.customer_selection&.customer_id
    end

end