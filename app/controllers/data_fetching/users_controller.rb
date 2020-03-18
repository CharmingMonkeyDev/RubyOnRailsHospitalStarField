class DataFetching::UsersController < ApplicationController
    include JsonHelper
    require 'net/http'
    require 'json'
    require "#{Rails.root}/app/helpers/patient_data_helper"
    include PatientDataHelper
    before_action :verify_customer_selection
    before_action :authenticate_reporting_app, only: [:get_patients]
    skip_before_action :authenticate_user!, only: [:get_patients]

    def edit_patient_info
        user = User.find(params[:patient_id])
        result = {
            id: user.id,
            name: user.name,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            address: user.address,
            city: user.city,
            state: user.state,
            zip: user.zip,
            mobile_phone_number: user.mobile_phone_number,
            date_of_birth: user.date_of_birth,
            formatted_date_of_birth: user.formatted_date_of_birth,
            js_formatted_dob: user.js_formatted_dob,
            gender: user.gender,
            email: user.email
        }
        log_info("User ID #{current_user&.id} accessed id, name, address, city, state, zip, mobile_phone_number, date_of_birth, gender, email for user ID #{user&.id} -- UsersController::edit_patient_info")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::edit_patient_info")
        json_response(e, 500)
    end

    def my_info
        user = User.find(params[:patient_id])
        result = {
            name: user.name,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            address: user.address,
            city: user.city,
            state: user.state,
            zip: user.zip,
            mobile_phone_number: user.mobile_phone_number,
            date_of_birth: user.date_of_birth,
            gender: user.gender,
            email: user.email
        }
        log_info("User ID #{current_user&.id} accessed name, address, city, state, zip, mobile_phone_number, date_of_birth, gender, email for user ID #{user&.id} --UsersController::my_info")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::my_info")
        json_response(e, 500)
    end

    def medications
        user = User.find(params[:patient_id])
        result = {
            id: user.id,
            patient_medications: user.patient_medications
        }
        log_info("User ID #{current_user&.id} accessed id, patient_medications for user ID #{user&.id} -- UsersController::medications")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::medications")
        json_response(e, 500)
    end

    #this is only valid for current user
    def edit_provider
        user = current_user
        result = {
            id: user.id,
            name: user.name,
            first_name: user.first_name,
            last_name: user.last_name,
            middle_name: user.middle_name,
            mobile_phone_number: user.mobile_phone_number,
            email: user.email,
            privileges: user.get_user_privileges,
            customer_selection_id: user.customer_selection&.id,
            do_not_ask: user.customer_selection&.do_not_ask,
        }
        log_info("User ID #{current_user&.id} accessed id, name, first_name, last_name, middle_name, phone_number, for user ID #{user&.id} --UsersController::edit_provider")
        render json: Result.new(result, "Provider Information fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::edit_provider")
        render json: Result.new(nil, e, false), status: 200
    end

    def patient_information
        user = User.find(params[:patient_id])
        result = {
            id: user.id,
            name: user.name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            city: user.city,
            state: user.state,
            zip: user.zip,
            patient_medications: user.patient_medications,
            assigned_pathways: user.assigned_pathways,
            assigned_actions: user.assigned_actions,
            adt_notifications_turned_on: user.adt_notifications_turned_on,
            adt_disable_minutes: user.get_adt_disabled_minutes,
            linked_with_ndhin: user.patient_identifier.present?,

        }
        log_info("User ID #{current_user&.id} accessed id, name, gender, date_of_birth, city, state, zip, patient_notes, patient_medications, assigned_pathways, assigned_actions for user ID #{user&.id} --UsersController::patient_information")
        render json: Result.new(result, "Patient Information fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::patient_information")
        json_response(e, 500)
    end

    def edit_my_info
        patient = User.find(params[:patient_id])
        result = {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            first_name: patient.first_name,
            middle_name: patient.middle_name,
            last_name: patient.last_name,
            address: patient.address,
            city: patient.city,
            state: patient.state,
            zip: patient.zip,
            county: patient.county,
            race: patient.race,
            ethnicity: patient.ethnicity,
            date_of_birth: patient.date_of_birth,
            formatted_date_of_birth: patient.formatted_date_of_birth,
            mobile_phone_number: patient.mobile_phone_number,
            gender: patient.gender,
            mrn_number: patient.mrn_number,
            js_formatted_dob: patient.js_formatted_dob,
            user_creation_type: patient.user_creation_type

        }
        log_info("User ID #{current_user&.id} accessed id, name, email, address, city, state, zip, date_of_birth, mobile_phone_number, gender for user ID #{patient&.id} --UsersController::edit_my_info")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::edit_my_info")
        json_response(e, 500)
    end

    def edit_my_email
        patient = User.find(params[:patient_id])
        result = {
            id: patient.id,
            email: patient.email
        }
        log_info("User ID #{current_user&.id} accessed id, email for user ID #{patient&.id} --UsersController::edit_my_email")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::edit_my_email")
        json_response(e, 500)
    end

    def add_action_group_pathway
        user = User.find(params[:user_id])
        result = {
            user: {
                id: user.id,
                customer_id: user.customer_selection.customer.id,
                selected_customer: user.customer_selection.customer.id
            },
            action_categories: user&.get_action_categories
        }
        log_info("User ID #{current_user&.id} accessed id, customer_id, action_category for user ID #{user&.id} --UsersController::add_action_group_pathway")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::add_action_group_pathway")
        json_response(e, 500)
    end

    def care_plan_management
        if check_privilege("Access Care Plan Builder")
            user = User.find(params[:user_id])
            result = {
                user: {
                    id: user.id,
                    role: user.role,
                    selected_customer: user.customer_selection.customer.id
                },
                customer_users: user&.customer_selection&.customer&.users.care_plan_scope.map{|u| u.custom_json(:care_plan_management)},
                action_pathways: user&.customer_selection&.customer&.action_pathways,
                action_groups: user&.get_action_groups,
                action_categories: user&.get_action_categories,
                category_options: user&.get_category_options
            }
            log_info("User ID #{current_user&.id} accessed id, role, customer_users, action_pathways, action_groups, action_categories for user ID #{user&.id} --UsersController::care_plan_management")
            render json: result, status: 200
        else
            render json: Result.new(result, "Access Denied", true), status: 200
        end
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::care_plan_management")
        render json: Result.new(result, e, false), status: 200
    end

    def care_plan
        patient = User.find(params[:user_id])
        result = {
            id: patient.id,
            assigned_actions: patient.assigned_actions
        }
        log_info("User ID #{current_user&.id} accessed id, assigned_actions for user ID #{patient&.id} --UsersController::care_plan")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::care_plan")
        json_response(e, 500)
    end

    def add_data
        patient = User.find(params[:user_id])
        result = {
            id: patient.id,
            patient_device_id: patient&.patient_device&.id
        }
        log_info("User ID #{current_user&.id} accessed id, patient_device_id for user ID #{patient&.id} --UsersController::add_data")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::add_data")
        json_response(e, 500)
    end

    def add_glucose
        patient = User.find(params[:user_id])
        result = {
            id: patient.id,
            patient_device_id: patient.patient_device.id
        }
        log_info("User ID #{current_user&.id} accessed id, patient_device_id for user ID #{patient&.id} --UsersController::add_glucose")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::add_glucose")
        json_response(e, 500)
    end

    def app
        user = User.find(params[:user_id])
        result = {
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                terms: user.terms,
                privileges: user.get_user_privileges
            },
        }
        log_info("User ID #{current_user&.id} accessed id, name, role for user ID #{user&.id} --UsersController::app")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::app")
        json_response(e, 500)
    end

    def sync_device
        patient = User.find(params[:user_id])
        result = {
            id: patient.id,
            name: patient.patient_device
        }
        log_info("User ID #{current_user&.id} accessed patient_device for user ID #{patient&.id} --UsersController::sync_device")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::sync_device")
        json_response(e, 500)
    end

    def my_data
        user = User.find(params[:user_id])
        result = {
            id: user.id,
            weight_readings: user.weight_readings,
            blood_pressure_readings: user.blood_pressure_readings,
            patient_device: user.patient_device
        }
        log_info("User ID #{current_user&.id} accessed weight_readings, blood_pressure_reading, and patient_device for user ID #{user&.id} --UsersController::mydata")
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::my_data")
        json_response(e, 500)
    end

    def patient_index
        selected_customer = current_user.customer_selection.customer
        actively_assigned_user_ids =  selected_customer.customer_users.active_or_pending.pluck(:user_id).uniq
        # role 0 is patient
        if params[:filters_only] 
            patient_users = []
            params.delete_if { |key, _| key.present? }
        else         
            patient_users = User.includes(:assigned_patient_lists).left_outer_joins(:follow_up_date).where(id: actively_assigned_user_ids,role: 0).order(:last_name)
        end
        if params[:patient_list].present?
            @patient_list = current_user.patient_lists.find(params[:patient_list])
            ids = @patient_list.patients.ids
            patient_users = patient_users.where(id: ids)
        elsif params[:ref_patient_list].present?
            @patient_list = current_user.patient_lists.find(params[:ref_patient_list])
        end
        if params[:first_name].present?
            patient_users = patient_users.where("lower(users.first_name) ILIKE ?", "%#{params[:first_name]}%")
          end
          if params[:last_name].present?
            patient_users = patient_users.where("lower(users.last_name) ILIKE ?", "%#{params[:last_name]}%")
          end
          if params[:date_of_birth].present?
            patient_users = patient_users.where("date(users.date_of_birth) = ?", params[:date_of_birth])
          end
          if params[:follow_up_date].present?
            patient_users = patient_users.where('date(follow_up_dates.next_date) = ?', params[:follow_up_date])
          end
          if params[:programs].present?
            program_ids = params[:programs].map(&:to_i)
            patient_users = patient_users.where(id: User.joins(:programs)
            .group('users.id')
            .having('ARRAY_AGG(programs.id::bigint) @> ARRAY[?]::bigint[]', program_ids))
          end
          if params[:diagnosis_codes].present?
            diagnosis_ids = params[:diagnosis_codes].map(&:to_i)
            patient_users = patient_users.select do |user|
                user_diagnosis_ids = user.diagnosis_assignments.where(active: true).pluck(:id).uniq
                (diagnosis_ids - user_diagnosis_ids).empty?
              end
          end

          # Filter by Patient Insurance IDs if provided
          if params[:insurance_types].present?
            insurance_ids = params[:insurance_types].map(&:to_i)
            insurance_type_names = PatientInsuranceType.where(id: insurance_ids).pluck(:insurance_type)

            patient_users = patient_users.select do |user|
                user_insurance_types = user.patient_insurances.pluck(:insurance_type).uniq
                (insurance_type_names - user_insurance_types).empty?
              end
          end

          if params[:ltc_facilities].present?
            facility_ids = params[:ltc_facilities].map(&:to_i)
            patient_users = patient_users.select do |user|
                user_facility_ids = user.ltc_facility_assignments.pluck(:ltc_facility_id).uniq
                (facility_ids - user_facility_ids).empty?
            end
          end
          if params[:is_cgm] == 'true'
            patient_users = patient_users.joins(:glucose_readings).distinct
          end

        log_info("User ID #{current_user&.id} accessed patient list for Customer ID #{selected_customer&.id} --UsersController::patient_index")
        
        patients_json = patient_users.map do |pu| 
            on_list = pu.assigned_patient_lists.any?{|pl| pl.id == @patient_list&.id}
            pu.as_json(
                include: {},
                methods: [:program_titles, :diagnosis_code_values, :insurance_types_list, :ltc_facility_names, :cgm_present?]
            ).merge(
                {
                    on_list: on_list,
                    list_status: on_list ? "On List" : "Not on List"
                }
            )
        end 
        result = {
            patients: patients_json,
            patient_lists: current_user.patient_lists,
            programs: Program.all,
            diagnosis_codes: DiagnosisAssignment.where(active: true).order(created_at: :asc).uniq,
            insurance_types: PatientInsuranceType.where(display_on_ui: true).order(:sort_order),
            ltc_facilities: selected_customer.ltc_facilities
          }

        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::patient_index")
        json_response(e, 500)
    end

    def patient_index_patient_list
        selected_customer = current_user.customer_selection.customer
        actively_assigned_user_ids =  selected_customer.customer_users.active_or_pending.pluck(:user_id).uniq
        # role 0 is patient
        patient_users = User.left_outer_joins(:follow_up_date).where(id: actively_assigned_user_ids,role: 0).order(:last_name)
        if params[:first_name].present?
            patient_users = patient_users.where("lower(first_name) ILIKE ? ", "%#{params[:first_name]}%")
        end
        if params[:last_name].present?
            patient_users = patient_users.where("lower(last_name) ILIKE ? ", "%#{params[:last_name]}%")
        end
        if params[:add_patients].present?
          if params[:patient_list].present?
            patient_list = current_user.patient_lists.find(params[:patient_list])
            ids = patient_list.patients.ids
            patient_users = patient_users.where.not(id: ids)
          end
        else
          if params[:patient_list].present?
            patient_list = current_user.patient_lists.find(params[:patient_list])
            ids = patient_list.patients.ids
            patient_users = patient_users.where(id: ids)
          end
        end

        log_info("User ID #{current_user&.id} accessed patient list for Customer ID #{selected_customer&.id} --UsersController::patient_index")
        result = {
            patients: patient_users.as_json({include: %i[]}),
            patient_lists: current_user.patient_lists
        }
        render json: result, status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::patient_index")
        json_response(e, 500)
    end

    def customer_association_index
        user = User.find(params[:user_id])
        customer_users = user.customer_users.order(:status)
        accepted_count = customer_users.where(status: "accepted").count

        tz = params[:tz].present? ? params[:tz] : "Central Time (US & Canada)"
        zone = ActiveSupport::TimeZone.new(tz)

        formatted_customer_users = []
        customer_users.each do |cu|
            formatted_assigned_at = cu.assigned_at.in_time_zone(zone)
            new_cu = cu.as_json
            new_cu[:formatted_assigned_at] = formatted_assigned_at&.strftime("%m/%d/%Y")
            new_cu[:formatted_assigned_at_time] = formatted_assigned_at&.strftime("%l:%M %P")
            formatted_customer_users << new_cu
        end

        result = {
            customer_associations: formatted_customer_users,
            deletable: accepted_count > 1
        }
        log_info("User ID #{current_user&.id} accessed customer user association for user  #{user&.id} --UsersController::customer_association_index")
        render json: Result.new(result, "Customer association fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  -- UsersController::customer_association_index")
        render json: Result.new(nil, e, false), status: 200
    end

    def basic_user_info
        user = User.find(params[:user_id])
        result = {
            id: user.id,
            name: user.name,
            role: user.role,
            selected_customer_name: @selected_customer&.customer&.name,
        }
        log_info("User ID #{current_user&.id} accessed id, name,role for user ID #{user&.id} --DataFetching::PatientsController#basic_user_info")
        render json: Result.new(result, "Basic User information fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::PatientsController#basic_user_info")
        render json: Result.new(nil, e, false), status: 500
    end

    def current_user_role
        log_info("User ID #{current_user&.id} accessed role for user ID #{current_user&.id} --DataFetching::PatientsController#current_user_role")
        render json: Result.new(current_user&.role, "Basic User information fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::PatientsController#basic_user_info")
        render json: Result.new(nil, e, false), status: 500
    end

    def get_patients
        patients = User.where(role: :patient).all
        patients = patients.map { |user| { id: user.id, date_of_birth: user.date_of_birth, first_name: user.first_name, last_name: user.last_name } }

        render json: Result.new(patients, "Patient users fetched", true), status: 200
    end
end