class EncountersController < ApplicationController

    def index
        provider = current_user
        active_customer = current_user.customer_selection.customer
        patient = User.find(params[:patient_id])
        encounter_billings = patient.encounter_billings

        render json: Result.new(encounter_billings, "Encounter billings fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#index")
        render json: Result.new(nil, "Encounter could not fetched", false), status: 500
    end

    def claim_information_assets
        selected_customer = current_user.customer_selection.customer
        actively_assigned_user_ids =  selected_customer.customer_users.active_or_pending.pluck(:user_id).uniq
        provider_users = User.where(id: actively_assigned_user_ids).where.not(role: "patient").order(:last_name)
        log_info("User ID #{current_user&.id} accessed provider list for Customer ID #{selected_customer&.id} --EncountersController::rendering_providers")
        result = {
            providers: provider_users,
            cpt_code_options: CptCode.order(:name)
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#claim_information_assets")
        render json: Result.new(nil, "Data fetched", false), status: 500
    end

    def new
        provider = current_user
        active_customer = current_user.customer_selection.customer
        if params[:encounter_id].present?
            
            encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_id])

            if encounter_billing
                data = {
                    creation_type: "existing",
                    place_of_service: encounter_billing.place_of_service,
                    encounter_types: EncounterBilling.encounter_types,
                    encounter_billing_id: encounter_billing.id,
                    status: encounter_billing.status,
                    BILLING_INTEGRATON_ON: ENV["BILLING_INTEGRATON_ON"]
                }
            else
                flash[:alert] = "Cannot find such billing."
                redirect_to root_path
                return
            end
        else
            data = {
                creation_type: "new",
                place_of_service: active_customer.name,
                encounter_types: EncounterBilling.encounter_types,
                status: "pended",
                BILLING_INTEGRATON_ON: ENV["BILLING_INTEGRATON_ON"]
            }
        end
        
        render json: Result.new(data, "Assets fetched.", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#new")
        render json: Result.new(nil, "Could not fetch the assets.", false), status: 500
    end

    def pend
        provider = current_user
        result = ProcessBillingFormCreation.new(permit_params.merge({provider_name: provider.name, created_by_id: provider.id})).call
        render json: result, status: 200
    rescue StandardError => e
        Rails.logger.error {e}  
        Rails.logger.error {e.backtrace.join("\n")}  
        Rollbar.warning("Error: #{e} --EncountersController#pend")
        render json: Result.new(nil, "Encounter could not pend", false), status: 500
    end

    def destroy
        encounter_billing = EncounterBilling.find(params[:id])
        encounter_billing.destroy
        
        render json: Result.new(nil, "Encounter Record Deleted", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#destroy")
        render json: Result.new(nil, "Encounter Record Could not Deleted", false), status: 500
    end

    def add_billing_addendum
        provider = current_user
        encounter_billing = EncounterBilling.find(params[:encounter_billing_id])
        encounter_billing.encounter_notes.create(encounter_notes_permit_params.merge({creator_id: provider.id, addendum: true}))
        encounter_billing.encounter_billing_loggers.create(
            user_id: provider.id,
            name: provider.name,
            action: "added_addendum"
        )
        render json: Result.new({notes: encounter_billing.notes_json, addendums: encounter_billing.formatted_addendums}, "Addendum added", true), status: 200
    rescue StandardError => e
        Rails.logger.error e
        Rails.logger.error e.backtrace.join("\n")
        Rollbar.warning("Error: #{e} --EncountersController#add_billing_addendum")
        render json: Result.new(nil, "Addendum cannot be added", false), status: 500
    end

    def send_charges 
        encounter_billing = EncounterBilling.find(params[:encounter_billing_id])
        encounter_billing.encounter_billing_loggers.create(
            user_id: current_user.id,
            name: current_user.name,
            action: "sent_charges"
        )

        response = ProcessSendChargesChangeHealthcare.new({encounter_billing_id: encounter_billing.id}).call
        log_id = response[:eb_send_charges_log_id]
        validation_status = response[:validation_status]
        submission_status = response[:submission_status]
        log = EbSendChargesLog.find(log_id)
        log.update(user_id: current_user.id)
        render json: Result.new({log:log, validation_status: validation_status, submission_status: submission_status}, "Send charges submitted", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#send_charges")
        render json: Result.new(nil, "Send Charges cannot be created", false), status: 500
    end

    # these methods are to fetch the existing encounter information by per panel

    def encounter_information_panel_data 
        encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
        render json: Result.new(encounter_billing, "Encounter Billing Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#encounter_information_panel_data")
        render json: Result.new(nil, "Encounter Billing Cannot Found", false), status: 500
    end

    def encounter_notes_panel_data 
        encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
        render json: Result.new({notes: encounter_billing&.notes_json, addendums: encounter_billing&.formatted_addendums}, "Encounter Billing Fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --EncountersController#encounter_notes_panel_data")
        render json: Result.new(nil, "Encounter Billing Cannot Found", false), status: 500
    end

    def patient_instructions_panel_data 
      encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
      render json: Result.new({instructions: encounter_billing&.patient_instruction.full_json}, "Encounter Billing Fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --EncountersController#patient_instructions_panel_data")
        render json: Result.new(nil, "Encounter Billing Cannot Found", false), status: 500
    end 

    def patient_and_insurance_panel_data 
        encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
        encounter_insurance_information = encounter_billing.encounter_insurance_information
        return_obj = {
            patient_insurance: encounter_insurance_information,
            insurance_types: PatientInsuranceType.where(display_on_ui: true).order(:sort_order)
        }
        render json: Result.new(return_obj, "Patient Insurance Fetched fron encounter_billing object", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#patient_and_insurance_panel_data")
        render json: Result.new(nil, e, false), status: 500
    end

    def billing1500_panel_data 
        encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
        render json: Result.new(encounter_billing&.encounter1500_information, "1500 Billing Data Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#billing1500_panel_data")
        render json: Result.new(nil, "Billing 1500 data cannot be found", false), status: 500
    end

    def claim_information_panel_data
        encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
        render json: Result.new(encounter_billing&.encounter_claim_informations, "Claim Information Data Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#claim_information_panel")
        render json: Result.new(nil, "Billing 1500 data cannot be found", false), status: 500
    end

    def rendering_provider_data
        encounter_billing = EncounterBilling.find_by_uuid(params[:encounter_billing_id])
        render json: Result.new({rendering_provider: encounter_billing.rendering_provider}, "Claim Information Data Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#claim_information_panel")
        render json: Result.new(nil, "Billing 1500 data cannot be found", false), status: 500
    end

    def encounter_logs_panel_data
        # the expected billing id here is encouter primary key id
        encounter_billing = EncounterBilling.find(params[:encounter_billing_id])
        logs = encounter_billing.encounter_billing_loggers.order("created_at desc")
        tz = params[:tz].present? ? params[:tz] : "Central Time (US & Canada)"
        zone = ActiveSupport::TimeZone.new(tz)
        formatted_logs = []
        logs.each do |log|
            formatted_created_at = log.created_at.in_time_zone(zone)
            formatted_log = "#{log&.name} #{log&.action&.titleize&.downcase} on #{formatted_created_at&.strftime("%m/%d/%Y at %I:%M%P")}"
            new_log = log.as_json
            new_log[:formatted_log] = formatted_log
            formatted_logs << new_log
        end
        render json: Result.new(formatted_logs, "Encounter Billing logs fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#encounter_logs_panel_data")
        render json: Result.new(nil, e, false), status: 500
    end

    def previously_used_codes
        user = User.find(params[:user_id])
        encounter_billing_ids = user.encounter_billings.pluck(:id)&.uniq
        encounter_claims = EncounterClaimInformation.where(encounter_billing_id: encounter_billing_ids).order("created_at desc").limit(50)
        cpt_codes = encounter_claims.where(is_manual_cpt_code: false).pluck(:cpt_code)&.uniq&.compact&.reject(&:empty?)
        diag_codes =  encounter_claims.pluck(:diagnosis_code_value, :diagnosis_code_desc)
        result = {
            cpt_codes: cpt_codes,
            diag_codes: remove_duplicate_and_null_codes(diag_codes)
        }
        render json: Result.new(result, "Previously used codes fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --EncountersController#previously_used_codes")
        render json: Result.new(nil, e, false), status: 500
    end

    # used for testing
    def instructions_pdf
      @encounter = EncounterBilling.find_by_uuid(params[:encounter_id])
      @provider = @encounter.created_by #should be from en
      @patient = @encounter.patient

      # authorization check
      unless @patient.in? current_user.get_patients
        raise StandardError.new("User #{current_user.id} not authorizred to perform this action on patient #{@patient.id}")
      end 

      @instructions = @encounter.patient_instruction&.to_text
      @medications = @patient.patient_medications 

      respond_to do |format|
        format.html do render layout: false end
        format.pdf do
          render pdf: "patient_instructions", layout: false,
          template: "encounters/instructions_pdf.html.erb",
          page_size: "Letter",
          margin:  {   
            top:  8,                    
            bottom: 8,
            left: 0,
            right: 0, 
          },
          footer: 
                 { html: 
                   { template: 'pdf/footer.html.erb', 
                     layout: false,
                    }
                  }
        end
      end
    end 

    # not currently used
    def send_instructions_pdf 
        @encounter = EncounterBilling.find_by_uuid(params[:encounter_id])
        @provider = current_user 
        @patient = @encounter.patient

        # authorization check
        unless @patient.in? current_user.get_patients
          raise StandardError.new("User #{current_user.id} not authorizred to perform this action on patient #{@patient.id}")
        end 
        @instructions = @encounter.patient_instruction&.to_text
        @medications = @patient.patient_medications 

        html = render_to_string(template: "encounters/instructions_pdf.html.erb", layout: false)
        pdf = WickedPdf.new.pdf_from_string(html)

        PdfMailer.send_instructions_pdf(@patient.id, pdf).deliver_later
        flash[:notice] = "PDF sent to patient"
        render json: {message: "OK"}, status: 200 
    rescue => e 
      log_errors(e)
      flash[:notice] = "Error sending PDF"
      render json: {message: "Error"}, status: 500 
    end

    private
    def remove_duplicate_and_null_codes(diag_codes_array)
        final_codes = []
        diag_codes_array.each do |diag_code|
            if diag_code.first.present?
                unless final_codes.flatten.include?(diag_code.first)
                    final_codes.push(diag_code)
                end
            end
        end
        final_codes
    end

    def permit_params
        params.require(:encounter).permit(
            :patient_id, 
            :generate_claim, 
            :encounter_type, 
            :day_of_encounter, 
            :place_of_service, 
            :status,
            :encounter_billing_id,
            :rendering_provider,
            blocks: [:note, :order],
            instruction_blocks: [:note, :order],
            claim_information_object: [
                :id,
                :cptCode,
                :units,
                :charges,
                :showModifier,
                :modifier,
                :isManualCptCode,
                diagnosisCode: [],
                diagnosisCodeOptions: []
            ],
            insurance_object: [
                :insurance_type,
                :plan_name,
                :insured_id,
                :relationship,
                :insured_name,
                :insured_dob,
                :address,
                :city,
                :state,
                :zip,
                :insured_phone_number,
                :feca_number,
                :insured_sex,
                :other_claim_id,
                :medicare_plan_name,
                :another_benefit_plan_present,
                :service_partner_id,
                :claim_filing_code

            ],
            billing_1500_obj: [
                :employment_present,
                :accident_present,
                :accident_state,
                :other_accident_present,
                :current_illness_date,
                :qual_1,
                :other_date,
                :qual_2,
                :unable_to_work_start_date,
                :unable_to_work_end_date,
                :ref_prov_name,
                :ref_prov_a_field,
                :ref_prov_npi,
                :hospitalization_start_date,
                :hospitalization_end_date,
                :additional_claim,
                :outside_lab,
                :charges,
                :resubmission_code,
                :original_ref_number,
                :prior_auth_number,
                :fed_tax_id_type,
                :fed_tax_id_no,
                :accept_assignment,
                :total_charge,
                :amount_paid,
                :serv_fac_name,
                :serv_fac_address,
                :serv_fac_phone, 
                :serv_fac_npi,
                :serv_fac_field_b,
                :prov_name,
                :prov_address,
                :prov_phone,
                :prov_npi,
                :prov_field_b,
            ],
        )
    end

    def encounter_notes_permit_params
        params.require(:encounter_notes).permit(
            :notes
        )
    end
end
