# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_10_23_200012) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "action_categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "sort"
    t.bigint "customer_id"
    t.boolean "is_archived", default: false
    t.index ["customer_id"], name: "index_action_categories_on_customer_id"
  end

  create_table "action_pathway_week_actions", force: :cascade do |t|
    t.bigint "action_pathway_week_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "text"
    t.string "subtext"
    t.boolean "recurring"
    t.index ["action_pathway_week_id"], name: "index_action_pathway_week_actions_on_action_pathway_week_id"
  end

  create_table "action_pathway_weeks", force: :cascade do |t|
    t.bigint "action_pathway_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_pathway_id"], name: "index_action_pathway_weeks_on_action_pathway_id"
  end

  create_table "action_pathways", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "customer_id"
  end

  create_table "action_queue_histories", force: :cascade do |t|
    t.bigint "action_queue_id", null: false
    t.bigint "user_id"
    t.string "history_type"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_queue_id"], name: "index_action_queue_histories_on_action_queue_id"
    t.index ["user_id"], name: "index_action_queue_histories_on_user_id"
  end

  create_table "action_queues", force: :cascade do |t|
    t.bigint "patient_id"
    t.bigint "action_id"
    t.bigint "assigned_program_id"
    t.bigint "assigned_provider_action_id"
    t.bigint "assigned_to_id"
    t.date "due_date", null: false
    t.string "status", default: "incomplete", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "deleted_at"
    t.index ["action_id"], name: "index_action_queues_on_action_id"
    t.index ["assigned_program_id"], name: "index_action_queues_on_assigned_program_id"
    t.index ["assigned_provider_action_id"], name: "index_action_queues_on_assigned_provider_action_id"
    t.index ["assigned_to_id"], name: "index_action_queues_on_assigned_to_id"
    t.index ["patient_id"], name: "index_action_queues_on_patient_id"
  end

  create_table "action_recurrences", force: :cascade do |t|
    t.boolean "start_on_program_start"
    t.boolean "start_after_program_start"
    t.integer "start_after_program_start_value"
    t.string "start_after_program_start_unit"
    t.boolean "repeat"
    t.integer "repeat_value"
    t.string "repeat_unit"
    t.boolean "monday"
    t.boolean "tuesday"
    t.boolean "wednesday"
    t.boolean "thursday"
    t.boolean "friday"
    t.boolean "saturday"
    t.boolean "sunday"
    t.boolean "no_end_date"
    t.boolean "end_after_occurences"
    t.integer "occurences"
    t.boolean "end_after_program_start"
    t.integer "end_date_value"
    t.integer "end_after_program_start_value"
    t.string "end_after_program_start_unit"
    t.bigint "action_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "end_timing"
    t.index ["action_id"], name: "index_action_recurrences_on_action_id"
  end

  create_table "action_resources", force: :cascade do |t|
    t.bigint "patient_action_id", null: false
    t.bigint "resource_item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["patient_action_id"], name: "index_action_resources_on_patient_action_id"
    t.index ["resource_item_id"], name: "index_action_resources_on_resource_item_id"
  end

  create_table "action_step_automations", force: :cascade do |t|
    t.string "automation_type"
    t.string "activity_type", default: "sending"
    t.bigint "action_step_id"
    t.bigint "questionnaire_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_step_id"], name: "index_action_step_automations_on_action_step_id"
    t.index ["questionnaire_id"], name: "index_action_step_automations_on_questionnaire_id"
  end

  create_table "action_step_queues", force: :cascade do |t|
    t.bigint "action_queue_id", null: false
    t.bigint "action_step_id", null: false
    t.string "status", default: "incomplete"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_queue_id"], name: "index_action_step_queues_on_action_queue_id"
    t.index ["action_step_id"], name: "index_action_step_queues_on_action_step_id"
  end

  create_table "action_step_quick_launches", force: :cascade do |t|
    t.string "launch_type"
    t.bigint "action_step_id"
    t.bigint "questionnaire_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_step_id"], name: "index_action_step_quick_launches_on_action_step_id"
    t.index ["questionnaire_id"], name: "index_action_step_quick_launches_on_questionnaire_id"
  end

  create_table "action_step_resources", force: :cascade do |t|
    t.bigint "action_step_id", null: false
    t.bigint "resource_item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_step_id"], name: "index_action_step_resources_on_action_step_id"
    t.index ["resource_item_id"], name: "index_action_step_resources_on_resource_item_id"
  end

  create_table "action_steps", force: :cascade do |t|
    t.string "title"
    t.string "subtext"
    t.string "icon"
    t.bigint "action_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_id"], name: "index_action_steps_on_action_id"
  end

  create_table "actions", force: :cascade do |t|
    t.integer "action_type"
    t.string "title"
    t.datetime "published_at"
    t.string "subject"
    t.string "icon"
    t.boolean "is_archived", default: false
    t.bigint "action_category_id", null: false
    t.bigint "customer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "status"
    t.string "category"
    t.index ["action_category_id"], name: "index_actions_on_action_category_id"
    t.index ["customer_id"], name: "index_actions_on_customer_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "adt_inbound_notifications", force: :cascade do |t|
    t.string "file_name"
    t.string "file_content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "adt_outbound_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "message_date"
    t.string "message_control_id"
    t.string "request_payload"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "requested_by_id"
    t.index ["requested_by_id"], name: "index_adt_outbound_logs_on_requested_by_id"
    t.index ["user_id"], name: "index_adt_outbound_logs_on_user_id"
  end

  create_table "adt_patient_notifications", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "adt_inbound_notification_id", null: false
    t.string "message_control_id"
    t.datetime "event_date"
    t.string "event_type"
    t.string "patient_class"
    t.string "facility_name"
    t.string "diagnosis"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["adt_inbound_notification_id"], name: "index_adt_patient_notifications_on_adt_inbound_notification_id"
    t.index ["user_id"], name: "index_adt_patient_notifications_on_user_id"
  end

  create_table "adt_provider_actions", force: :cascade do |t|
    t.bigint "adt_patient_notification_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "action_queue_id"
    t.index ["action_queue_id"], name: "index_adt_provider_actions_on_action_queue_id"
    t.index ["adt_patient_notification_id"], name: "index_adt_provider_actions_on_adt_patient_notification_id"
  end

  create_table "ambulatory_weekly_results", force: :cascade do |t|
    t.json "results"
    t.bigint "user_id", null: false
    t.date "end_date"
    t.string "data_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_ambulatory_weekly_results_on_user_id"
  end

  create_table "answers", force: :cascade do |t|
    t.bigint "questionnaire_submission_id", null: false
    t.bigint "question_id", null: false
    t.text "answer_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "accepted"
    t.index ["question_id"], name: "index_answers_on_question_id"
    t.index ["questionnaire_submission_id"], name: "index_answers_on_questionnaire_submission_id"
  end

  create_table "assigned_action_resources", force: :cascade do |t|
    t.bigint "assigned_action_id", null: false
    t.bigint "resource_item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["assigned_action_id"], name: "index_assigned_action_resources_on_assigned_action_id"
    t.index ["resource_item_id"], name: "index_assigned_action_resources_on_resource_item_id"
  end

  create_table "assigned_actions", force: :cascade do |t|
    t.text "text"
    t.text "subtext"
    t.boolean "recurring"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "patient_action_group_id"
    t.datetime "completed_at"
    t.string "creation_type", default: "user_creation"
    t.index ["user_id"], name: "index_assigned_actions_on_user_id"
  end

  create_table "assigned_pathway_week_actions", force: :cascade do |t|
    t.bigint "assigned_pathway_week_id", null: false
    t.text "text"
    t.text "subtext"
    t.boolean "recurring"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "completed_at"
    t.integer "assigned_coach_id"
    t.string "status"
    t.string "creation_type", default: "user_creation"
    t.datetime "assigned_at"
    t.string "source"
    t.datetime "deferred_at"
    t.datetime "dismissed_at"
    t.datetime "deferred_until"
    t.index ["assigned_pathway_week_id"], name: "index_assigned_pathway_week_actions_on_assigned_pathway_week_id"
  end

  create_table "assigned_pathway_week_actions_resource_items", id: false, force: :cascade do |t|
    t.bigint "assigned_pathway_week_action_id", null: false
    t.bigint "resource_item_id", null: false
    t.index ["assigned_pathway_week_action_id", "resource_item_id"], name: "index_apwa_resource_on_apwa_id_and_resource_id"
    t.index ["resource_item_id", "assigned_pathway_week_action_id"], name: "index_apwa_resource_on_resource_id_and_apwa_id"
  end

  create_table "assigned_pathway_weeks", force: :cascade do |t|
    t.bigint "assigned_pathway_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "start_date"
    t.index ["assigned_pathway_id"], name: "index_assigned_pathway_weeks_on_assigned_pathway_id"
  end

  create_table "assigned_pathways", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "start_date"
    t.bigint "action_pathway_id"
    t.index ["action_pathway_id"], name: "index_assigned_pathways_on_action_pathway_id"
    t.index ["user_id"], name: "index_assigned_pathways_on_user_id"
  end

  create_table "assigned_programs", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "program_id", null: false
    t.string "status", default: "active", null: false
    t.datetime "start_date", null: false
    t.bigint "assigned_by_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["assigned_by_id"], name: "index_assigned_programs_on_assigned_by_id"
    t.index ["patient_id"], name: "index_assigned_programs_on_patient_id"
    t.index ["program_id"], name: "index_assigned_programs_on_program_id"
  end

  create_table "assigned_provider_actions", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "action_id", null: false
    t.datetime "start_date", null: false
    t.string "status", default: "active"
    t.bigint "assigned_by_id"
    t.bigint "assigned_provider_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_id"], name: "index_assigned_provider_actions_on_action_id"
    t.index ["assigned_by_id"], name: "index_assigned_provider_actions_on_assigned_by_id"
    t.index ["assigned_provider_id"], name: "index_assigned_provider_actions_on_assigned_provider_id"
    t.index ["patient_id"], name: "index_assigned_provider_actions_on_patient_id"
  end

  create_table "assignment_histories", force: :cascade do |t|
    t.string "loggable_type", null: false
    t.bigint "loggable_id", null: false
    t.bigint "patient_id", null: false
    t.bigint "user_id"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "notes"
    t.index ["loggable_type", "loggable_id"], name: "index_assignment_histories_on_loggable_type_and_loggable_id"
    t.index ["patient_id"], name: "index_assignment_histories_on_patient_id"
    t.index ["user_id"], name: "index_assignment_histories_on_user_id"
  end

  create_table "blood_pressure_readings", force: :cascade do |t|
    t.datetime "date_recorded"
    t.string "systolic_value"
    t.string "diastolic_value"
    t.text "notes"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "created_by_id"
    t.index ["created_by_id"], name: "index_blood_pressure_readings_on_created_by_id"
    t.index ["user_id"], name: "index_blood_pressure_readings_on_user_id"
  end

  create_table "board_messages", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "customer_id", null: false
    t.string "message"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_board_messages_on_customer_id"
    t.index ["user_id"], name: "index_board_messages_on_user_id"
  end

  create_table "chat_channel_users", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "chat_channel_id", null: false
    t.string "chat_user"
    t.string "user_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_channel_id"], name: "index_chat_channel_users_on_chat_channel_id"
    t.index ["user_id"], name: "index_chat_channel_users_on_user_id"
  end

  create_table "chat_channels", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "active", default: true
    t.string "uniq_channel_id"
    t.index ["user_id"], name: "index_chat_channels_on_user_id"
  end

  create_table "company_action_settings", force: :cascade do |t|
    t.bigint "customer_id"
    t.integer "global_action_future_days"
    t.integer "global_action_past_days"
    t.integer "patient_action_future_days"
    t.integer "patient_action_past_days"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_company_action_settings_on_customer_id"
  end

  create_table "cpt_codes", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.string "code"
  end

  create_table "customer_default_privileges", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.bigint "privilege_id", null: false
    t.boolean "default_pharmacist", default: false
    t.boolean "default_physician", default: false
    t.boolean "default_coach", default: false
    t.boolean "default_patient", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_customer_default_privileges_on_customer_id"
    t.index ["privilege_id"], name: "index_customer_default_privileges_on_privilege_id"
  end

  create_table "customer_permission_controls", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.bigint "customer_permission_id", null: false
    t.boolean "permitted", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_customer_permission_controls_on_customer_id"
    t.index ["customer_permission_id"], name: "index_customer_permission_controls_on_customer_permission_id"
  end

  create_table "customer_permissions", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "customer_selections", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.bigint "customer_id", null: false
    t.boolean "do_not_ask", default: false
    t.index ["customer_id"], name: "index_customer_selections_on_customer_id"
    t.index ["user_id"], name: "index_customer_selections_on_user_id"
  end

  create_table "customer_user_privileges", force: :cascade do |t|
    t.bigint "customer_user_id", null: false
    t.bigint "privilege_id", null: false
    t.boolean "privilege_state", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_user_id"], name: "index_customer_user_privileges_on_customer_user_id"
    t.index ["privilege_id"], name: "index_customer_user_privileges_on_privilege_id"
  end

  create_table "customer_users", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.bigint "customer_id", null: false
    t.datetime "assigned_at"
    t.datetime "accepted_at"
    t.datetime "cancelled_at"
    t.string "status"
    t.string "signature"
    t.bigint "created_by_id"
    t.index ["created_by_id"], name: "index_customer_users_on_created_by_id"
    t.index ["customer_id"], name: "index_customer_users_on_customer_id"
    t.index ["user_id"], name: "index_customer_users_on_user_id"
  end

  create_table "customers", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.string "address"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "notes"
    t.string "phone_number"
    t.string "facility_npi"
    t.string "federal_tax_id"
    t.string "place_of_service_code"
    t.string "county"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at", precision: 6
    t.datetime "updated_at", precision: 6
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "diagnosis_assignments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "diagnosis_code_value"
    t.string "diagnosis_code_desc"
    t.string "action_type"
    t.integer "actor_id"
    t.boolean "active", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_diagnosis_assignments_on_user_id"
  end

  create_table "eb_send_charges_logs", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "encounter_billing_id", null: false
    t.bigint "user_id"
    t.string "x12_data"
    t.jsonb "request_json"
    t.jsonb "validation_response_json"
    t.jsonb "submission_response_json"
    t.index ["encounter_billing_id"], name: "index_eb_send_charges_logs_on_encounter_billing_id"
    t.index ["user_id"], name: "index_eb_send_charges_logs_on_user_id"
  end

  create_table "encounter1500_informations", force: :cascade do |t|
    t.bigint "encounter_billing_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "employment_present"
    t.boolean "accident_present"
    t.string "accident_state"
    t.boolean "other_accident_present"
    t.datetime "current_illness_date"
    t.string "qual_1"
    t.datetime "other_date"
    t.string "qual_2"
    t.datetime "unable_to_work_start_date"
    t.datetime "unable_to_work_end_date"
    t.string "ref_prov_name"
    t.string "ref_prov_a_field"
    t.string "ref_prov_npi"
    t.datetime "hospitalization_start_date"
    t.datetime "hospitalization_end_date"
    t.string "additional_claim"
    t.boolean "outside_lab"
    t.string "charges"
    t.string "resubmission_code"
    t.string "original_ref_number"
    t.string "prior_auth_number"
    t.string "fed_tax_id_type"
    t.string "fed_tax_id_no"
    t.boolean "accept_assignment"
    t.string "total_charge"
    t.string "amount_paid"
    t.string "serv_fac_name"
    t.string "serv_fac_address"
    t.string "serv_fac_phone"
    t.string "serv_fac_npi"
    t.string "serv_fac_field_b"
    t.string "prov_name"
    t.string "prov_address"
    t.string "prov_phone"
    t.string "prov_npi"
    t.string "prov_field_b"
    t.index ["encounter_billing_id"], name: "index_encounter1500_informations_on_encounter_billing_id"
  end

  create_table "encounter_billing_loggers", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "encounter_billing_id", null: false
    t.bigint "user_id", null: false
    t.string "name"
    t.string "action"
    t.index ["encounter_billing_id"], name: "index_encounter_billing_loggers_on_encounter_billing_id"
    t.index ["user_id"], name: "index_encounter_billing_loggers_on_user_id"
  end

  create_table "encounter_billings", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "patient_id", null: false
    t.string "encounter_type"
    t.date "day_of_encounter"
    t.string "place_of_service"
    t.string "status"
    t.boolean "generate_claim"
    t.string "provider_name"
    t.bigint "created_by_id"
    t.string "rendering_provider"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "customer_id"
    t.string "interchange_number"
    t.string "transaction_set_number"
    t.index ["created_by_id"], name: "index_encounter_billings_on_created_by_id"
    t.index ["customer_id"], name: "index_encounter_billings_on_customer_id"
    t.index ["patient_id"], name: "index_encounter_billings_on_patient_id"
  end

  create_table "encounter_claim_informations", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "encounter_billing_id", null: false
    t.string "cpt_code"
    t.string "diagnosis_code_value"
    t.string "diagnosis_code_desc"
    t.integer "units"
    t.string "charges"
    t.string "modifier"
    t.boolean "is_manual_cpt_code", default: false
    t.index ["encounter_billing_id"], name: "index_encounter_claim_informations_on_encounter_billing_id"
  end

  create_table "encounter_insurance_informations", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "encounter_billing_id", null: false
    t.string "insurance_type"
    t.string "relationship"
    t.string "plan_name"
    t.string "insured_id"
    t.string "insured_name"
    t.datetime "insured_dob"
    t.string "address"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "insured_phone_number"
    t.string "feca_number"
    t.string "insured_sex"
    t.string "other_claim_id"
    t.string "medicare_plan_name"
    t.boolean "another_benefit_plan_present"
    t.string "service_partner_id"
    t.string "claim_filing_code"
    t.index ["encounter_billing_id"], name: "index_encounter_insurance_informations_on_encounter_billing_id"
  end

  create_table "encounter_note_blocks", force: :cascade do |t|
    t.bigint "encounter_note_id", null: false
    t.string "note"
    t.integer "order"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["encounter_note_id"], name: "index_encounter_note_blocks_on_encounter_note_id"
  end

  create_table "encounter_notes", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "notes", default: ""
    t.bigint "creator_id", null: false
    t.bigint "encounter_billing_id", null: false
    t.boolean "addendum", default: false
    t.index ["creator_id"], name: "index_encounter_notes_on_creator_id"
    t.index ["encounter_billing_id"], name: "index_encounter_notes_on_encounter_billing_id"
  end

  create_table "follow_up_dates", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "next_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_follow_up_dates_on_user_id"
  end

  create_table "glucose_readings", force: :cascade do |t|
    t.bigint "synced_account_id", null: false
    t.datetime "system_time"
    t.datetime "display_time"
    t.string "egv_value"
    t.string "real_time_value"
    t.string "smoothed_value"
    t.string "status"
    t.string "trend"
    t.string "trend_rate"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["synced_account_id"], name: "index_glucose_readings_on_synced_account_id"
  end

  create_table "instruction_blocks", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "patient_instruction_id", null: false
    t.string "note"
    t.integer "order"
    t.index ["patient_instruction_id"], name: "index_instruction_blocks_on_patient_instruction_id"
  end

  create_table "lab_readings", force: :cascade do |t|
    t.string "reading_type", null: false
    t.string "reading_value", null: false
    t.datetime "date_recorded", null: false
    t.bigint "user_id", null: false
    t.bigint "created_by_id", null: false
    t.text "notes"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_lab_readings_on_created_by_id"
    t.index ["user_id"], name: "index_lab_readings_on_user_id"
  end

  create_table "ltc_facilities", force: :cascade do |t|
    t.string "name"
    t.string "address_1"
    t.string "address_2"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "phone_number"
    t.bigint "customer_id"
  end

  create_table "ltc_facility_assignments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "ltc_facility_id", null: false
    t.string "action_type"
    t.integer "actor_id"
    t.boolean "active", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ltc_facility_id"], name: "index_ltc_facility_assignments_on_ltc_facility_id"
    t.index ["user_id", "ltc_facility_id"], name: "index_ltc_facility_assignments_on_user_id_and_ltc_facility_id"
    t.index ["user_id"], name: "index_ltc_facility_assignments_on_user_id"
  end

  create_table "multiple_choice_answers", force: :cascade do |t|
    t.bigint "answer_id", null: false
    t.bigint "option_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["answer_id"], name: "index_multiple_choice_answers_on_answer_id"
    t.index ["option_id"], name: "index_multiple_choice_answers_on_option_id"
  end

  create_table "ndm_reports", force: :cascade do |t|
    t.string "status", default: "processing"
    t.jsonb "data"
    t.jsonb "issues"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_archived", default: false
  end

  create_table "notes_template_blocks", force: :cascade do |t|
    t.bigint "notes_template_id", null: false
    t.string "note"
    t.integer "order"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["notes_template_id"], name: "index_notes_template_blocks_on_notes_template_id"
  end

  create_table "notes_templates", force: :cascade do |t|
    t.string "name"
    t.boolean "archived", default: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_notes_templates_on_user_id"
  end

  create_table "options", force: :cascade do |t|
    t.string "title", null: false
    t.bigint "question_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["question_id"], name: "index_options_on_question_id"
  end

  create_table "patient_action_group_actions", force: :cascade do |t|
    t.bigint "patient_action_group_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "text"
    t.string "subtext"
    t.boolean "recurring"
    t.index ["patient_action_group_id"], name: "index_patient_action_group_actions_on_patient_action_group_id"
  end

  create_table "patient_action_groups", force: :cascade do |t|
    t.string "name"
    t.string "icon"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "customer_id"
  end

  create_table "patient_actions", force: :cascade do |t|
    t.bigint "action_category_id", null: false
    t.text "text"
    t.text "subtext"
    t.boolean "recurring"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "icon"
    t.bigint "customer_id"
    t.index ["action_category_id"], name: "index_patient_actions_on_action_category_id"
    t.index ["customer_id"], name: "index_patient_actions_on_customer_id"
  end

  create_table "patient_device_readings", force: :cascade do |t|
    t.bigint "patient_device_id", null: false
    t.string "reading_type"
    t.string "reading_value"
    t.string "reading_id"
    t.datetime "date_recorded"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "source"
    t.text "notes"
    t.bigint "created_by_id"
    t.index ["created_by_id"], name: "index_patient_device_readings_on_created_by_id"
    t.index ["patient_device_id"], name: "index_patient_device_readings_on_patient_device_id"
  end

  create_table "patient_devices", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "identifier"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_patient_devices_on_user_id"
  end

  create_table "patient_forecast_immunizations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "vaccine_type"
    t.integer "dose_number"
    t.datetime "recommended_date"
    t.datetime "minimum_valid_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.date "defer_date"
    t.date "given_date"
    t.boolean "is_deleted", default: false
    t.bigint "provider_id"
    t.index ["provider_id"], name: "index_patient_forecast_immunizations_on_provider_id"
    t.index ["user_id"], name: "index_patient_forecast_immunizations_on_user_id"
  end

  create_table "patient_historical_immunizations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "vaccine_name"
    t.datetime "immunization_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_patient_historical_immunizations_on_user_id"
  end

  create_table "patient_instructions", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "notes", default: ""
    t.bigint "creator_id", null: false
    t.bigint "encounter_billing_id", null: false
    t.index ["creator_id"], name: "index_patient_instructions_on_creator_id"
    t.index ["encounter_billing_id"], name: "index_patient_instructions_on_encounter_billing_id"
  end

  create_table "patient_insurance_types", force: :cascade do |t|
    t.string "insurance_type", null: false
    t.boolean "display_on_ui", null: false
    t.integer "sort_order", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "patient_insurances", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "relationship"
    t.string "insured_id"
    t.string "insured_name"
    t.datetime "insured_dob"
    t.string "plan_name"
    t.string "address"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "insurance_type"
    t.string "phone_number"
    t.string "last_name"
    t.string "first_name"
    t.string "middle_name"
    t.string "county"
    t.integer "insured_user_id"
    t.bigint "secondary_patient_insurance_id"
    t.boolean "is_secondary", default: false
    t.index ["secondary_patient_insurance_id"], name: "index_patient_insurances_on_secondary_patient_insurance_id"
    t.index ["user_id"], name: "index_patient_insurances_on_user_id"
  end

  create_table "patient_lists", force: :cascade do |t|
    t.bigint "owner_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["owner_id"], name: "index_patient_lists_on_owner_id"
  end

  create_table "patient_lists_users", id: false, force: :cascade do |t|
    t.bigint "patient_list_id", null: false
    t.bigint "user_id", null: false
  end

  create_table "patient_medications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_patient_medications_on_user_id"
  end

  create_table "patient_ndiis_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "ndiis_patient_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_patient_ndiis_accounts_on_user_id"
  end

  create_table "patient_notes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_patient_notes_on_user_id"
  end

  create_table "place_of_service_codes", force: :cascade do |t|
    t.string "code"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "privileges", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "default_pharmacist"
    t.boolean "default_physician"
    t.boolean "default_coach"
    t.boolean "default_patient"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "program_actions", force: :cascade do |t|
    t.bigint "program_id"
    t.bigint "action_id"
    t.boolean "override_recurrence", default: false
    t.boolean "start_on_program_start"
    t.boolean "start_after_program_start"
    t.integer "start_after_program_start_value"
    t.string "start_after_program_start_unit"
    t.boolean "repeat"
    t.integer "repeat_value"
    t.string "repeat_unit"
    t.boolean "monday"
    t.boolean "tuesday"
    t.boolean "wednesday"
    t.boolean "thursday"
    t.boolean "friday"
    t.boolean "saturday"
    t.boolean "sunday"
    t.boolean "no_end_date"
    t.boolean "end_after_occurences"
    t.integer "occurences"
    t.boolean "end_after_program_start"
    t.integer "end_date_value"
    t.integer "end_after_program_start_value"
    t.string "end_after_program_start_unit"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "end_timing"
    t.index ["action_id"], name: "index_program_actions_on_action_id"
    t.index ["program_id"], name: "index_program_actions_on_program_id"
  end

  create_table "programs", force: :cascade do |t|
    t.string "title", null: false
    t.datetime "published_at"
    t.string "subtext"
    t.string "status", default: "draft"
    t.boolean "is_archived", default: false
    t.bigint "customer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_programs_on_customer_id"
  end

  create_table "provider_action_resources", force: :cascade do |t|
    t.bigint "action_id", null: false
    t.bigint "resource_item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["action_id"], name: "index_provider_action_resources_on_action_id"
    t.index ["resource_item_id"], name: "index_provider_action_resources_on_resource_item_id"
  end

  create_table "questionnaire_actions", force: :cascade do |t|
    t.bigint "questionnaire_submission_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "action_queue_id"
    t.index ["action_queue_id"], name: "index_questionnaire_actions_on_action_queue_id"
    t.index ["questionnaire_submission_id"], name: "index_questionnaire_actions_on_questionnaire_submission_id"
  end

  create_table "questionnaire_assignments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "provider_id", null: false
    t.bigint "questionnaire_id", null: false
    t.string "assignment_type"
    t.date "expiration_date"
    t.string "submission_status"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["provider_id"], name: "index_questionnaire_assignments_on_provider_id"
    t.index ["questionnaire_id"], name: "index_questionnaire_assignments_on_questionnaire_id"
    t.index ["user_id"], name: "index_questionnaire_assignments_on_user_id"
  end

  create_table "questionnaire_categories", force: :cascade do |t|
    t.bigint "customer_id"
    t.string "display_name"
    t.string "db_name"
    t.boolean "is_default"
    t.string "icon"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_archived", default: false
    t.index ["customer_id"], name: "index_questionnaire_categories_on_customer_id"
  end

  create_table "questionnaire_qrs", force: :cascade do |t|
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "customer_id", null: false
    t.integer "patient_id"
    t.integer "assigned_by_id"
    t.boolean "is_valid", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_questionnaire_qrs_on_customer_id"
  end

  create_table "questionnaire_resources", force: :cascade do |t|
    t.bigint "questionnaire_id", null: false
    t.bigint "resource_item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["questionnaire_id"], name: "index_questionnaire_resources_on_questionnaire_id"
    t.index ["resource_item_id"], name: "index_questionnaire_resources_on_resource_item_id"
  end

  create_table "questionnaire_submissions", force: :cascade do |t|
    t.bigint "questionnaire_assignment_id", null: false
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["questionnaire_assignment_id"], name: "index_questionnaire_submissions_on_questionnaire_assignment_id"
    t.index ["user_id"], name: "index_questionnaire_submissions_on_user_id"
  end

  create_table "questionnaires", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "customer_id", null: false
    t.string "name"
    t.string "description"
    t.string "category"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "published_at"
    t.bigint "resource_item_id"
    t.boolean "display_on_tablet", default: false
    t.bigint "questionnaire_category_id"
    t.index ["customer_id"], name: "index_questionnaires_on_customer_id"
    t.index ["questionnaire_category_id"], name: "index_questionnaires_on_questionnaire_category_id"
    t.index ["resource_item_id"], name: "index_questionnaires_on_resource_item_id"
    t.index ["user_id"], name: "index_questionnaires_on_user_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "title", null: false
    t.string "question_type", null: false
    t.bigint "questionnaire_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "position"
    t.index ["questionnaire_id"], name: "index_questions_on_questionnaire_id"
  end

  create_table "recurring_actions", force: :cascade do |t|
    t.boolean "active"
    t.integer "actionable_id"
    t.string "actionable_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "resource_items", force: :cascade do |t|
    t.string "name"
    t.string "link_url"
    t.string "resource_type"
    t.boolean "is_deleted", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "customer_id"
    t.index ["customer_id"], name: "index_resource_items_on_customer_id"
  end

  create_table "sqs_logs", force: :cascade do |t|
    t.jsonb "message"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "synced_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "account_type", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "access_token"
    t.string "refresh_token"
    t.index ["user_id"], name: "index_synced_accounts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "role"
    t.string "first_name"
    t.date "date_of_birth"
    t.string "invite_token"
    t.string "address"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "mobile_phone_number"
    t.string "gender"
    t.string "patient_identifier"
    t.boolean "is_active", default: true
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.datetime "last_contact_at"
    t.string "password_update_token"
    t.string "email_update_token"
    t.datetime "locked_at"
    t.integer "failed_attempts", default: 0
    t.string "unlock_token"
    t.string "middle_name"
    t.string "last_name"
    t.string "two_factor_verification_code"
    t.datetime "two_factor_verified_at"
    t.datetime "two_factor_code_sent_at"
    t.integer "two_factor_auth_attempts"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "mrn_number"
    t.string "user_creation_type"
    t.boolean "adt_notifications_turned_on", default: false
    t.string "provider_npi_number"
    t.boolean "terms", default: false
    t.datetime "adt_notif_modified_at"
    t.datetime "terms_timestamp"
    t.boolean "chat_notify", default: true
    t.uuid "opt_out_key", default: -> { "gen_random_uuid()" }, null: false
    t.date "last_contact"
    t.datetime "deleted_at"
    t.string "business_phone_number"
    t.string "county"
    t.string "race"
    t.string "ethnicity"
    t.bigint "patient_insurance_id"
    t.bigint "secondary_patient_insurance_id"
    t.bigint "ltc_facility_id"
    t.boolean "cgm_enabled", default: false, null: false
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["ltc_facility_id"], name: "index_users_on_ltc_facility_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "weight_readings", force: :cascade do |t|
    t.datetime "date_recorded"
    t.string "reading_value"
    t.text "notes"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "created_by_id"
    t.index ["created_by_id"], name: "index_weight_readings_on_created_by_id"
    t.index ["user_id"], name: "index_weight_readings_on_user_id"
  end

  add_foreign_key "action_categories", "customers"
  add_foreign_key "action_pathway_week_actions", "action_pathway_weeks"
  add_foreign_key "action_pathway_weeks", "action_pathways"
  add_foreign_key "action_queue_histories", "users"
  add_foreign_key "action_queues", "actions"
  add_foreign_key "action_queues", "assigned_programs"
  add_foreign_key "action_queues", "assigned_provider_actions"
  add_foreign_key "action_queues", "users", column: "assigned_to_id"
  add_foreign_key "action_queues", "users", column: "patient_id"
  add_foreign_key "action_resources", "patient_actions"
  add_foreign_key "action_resources", "resource_items"
  add_foreign_key "action_step_automations", "action_steps"
  add_foreign_key "action_step_automations", "questionnaires"
  add_foreign_key "action_step_queues", "action_queues"
  add_foreign_key "action_step_queues", "action_steps"
  add_foreign_key "action_step_quick_launches", "action_steps"
  add_foreign_key "action_step_quick_launches", "questionnaires"
  add_foreign_key "action_step_resources", "action_steps"
  add_foreign_key "action_step_resources", "resource_items"
  add_foreign_key "actions", "action_categories"
  add_foreign_key "actions", "customers"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "adt_outbound_logs", "users"
  add_foreign_key "adt_outbound_logs", "users", column: "requested_by_id"
  add_foreign_key "adt_patient_notifications", "adt_inbound_notifications"
  add_foreign_key "adt_patient_notifications", "users"
  add_foreign_key "adt_provider_actions", "action_queues"
  add_foreign_key "adt_provider_actions", "adt_patient_notifications"
  add_foreign_key "ambulatory_weekly_results", "users"
  add_foreign_key "answers", "questionnaire_submissions"
  add_foreign_key "answers", "questions"
  add_foreign_key "assigned_action_resources", "assigned_actions"
  add_foreign_key "assigned_action_resources", "resource_items"
  add_foreign_key "assigned_actions", "users"
  add_foreign_key "assigned_pathway_week_actions", "assigned_pathway_weeks"
  add_foreign_key "assigned_pathway_weeks", "assigned_pathways"
  add_foreign_key "assigned_pathways", "action_pathways"
  add_foreign_key "assigned_pathways", "users"
  add_foreign_key "assigned_programs", "programs"
  add_foreign_key "assigned_programs", "users", column: "assigned_by_id"
  add_foreign_key "assigned_programs", "users", column: "patient_id"
  add_foreign_key "assigned_provider_actions", "actions"
  add_foreign_key "assigned_provider_actions", "users", column: "assigned_by_id"
  add_foreign_key "assigned_provider_actions", "users", column: "assigned_provider_id"
  add_foreign_key "assigned_provider_actions", "users", column: "patient_id"
  add_foreign_key "assignment_histories", "users"
  add_foreign_key "assignment_histories", "users", column: "patient_id"
  add_foreign_key "blood_pressure_readings", "users"
  add_foreign_key "blood_pressure_readings", "users", column: "created_by_id"
  add_foreign_key "board_messages", "customers"
  add_foreign_key "board_messages", "users"
  add_foreign_key "chat_channel_users", "chat_channels"
  add_foreign_key "chat_channel_users", "users"
  add_foreign_key "chat_channels", "users"
  add_foreign_key "customer_default_privileges", "customers"
  add_foreign_key "customer_default_privileges", "privileges"
  add_foreign_key "customer_permission_controls", "customer_permissions"
  add_foreign_key "customer_permission_controls", "customers"
  add_foreign_key "customer_selections", "customers"
  add_foreign_key "customer_selections", "users"
  add_foreign_key "customer_user_privileges", "customer_users"
  add_foreign_key "customer_user_privileges", "privileges"
  add_foreign_key "customer_users", "customers"
  add_foreign_key "customer_users", "users"
  add_foreign_key "customer_users", "users", column: "created_by_id"
  add_foreign_key "diagnosis_assignments", "users"
  add_foreign_key "eb_send_charges_logs", "encounter_billings"
  add_foreign_key "eb_send_charges_logs", "users"
  add_foreign_key "encounter1500_informations", "encounter_billings"
  add_foreign_key "encounter_billing_loggers", "encounter_billings"
  add_foreign_key "encounter_billing_loggers", "users"
  add_foreign_key "encounter_billings", "users", column: "created_by_id"
  add_foreign_key "encounter_billings", "users", column: "patient_id"
  add_foreign_key "encounter_claim_informations", "encounter_billings"
  add_foreign_key "encounter_insurance_informations", "encounter_billings"
  add_foreign_key "encounter_note_blocks", "encounter_notes"
  add_foreign_key "encounter_notes", "encounter_billings"
  add_foreign_key "encounter_notes", "users", column: "creator_id"
  add_foreign_key "follow_up_dates", "users"
  add_foreign_key "glucose_readings", "synced_accounts"
  add_foreign_key "instruction_blocks", "patient_instructions"
  add_foreign_key "lab_readings", "users"
  add_foreign_key "lab_readings", "users", column: "created_by_id"
  add_foreign_key "ltc_facility_assignments", "ltc_facilities"
  add_foreign_key "ltc_facility_assignments", "users"
  add_foreign_key "multiple_choice_answers", "answers"
  add_foreign_key "multiple_choice_answers", "options"
  add_foreign_key "notes_template_blocks", "notes_templates"
  add_foreign_key "notes_templates", "users"
  add_foreign_key "options", "questions"
  add_foreign_key "patient_action_group_actions", "patient_action_groups"
  add_foreign_key "patient_actions", "action_categories"
  add_foreign_key "patient_actions", "customers"
  add_foreign_key "patient_device_readings", "patient_devices"
  add_foreign_key "patient_device_readings", "users", column: "created_by_id"
  add_foreign_key "patient_devices", "users"
  add_foreign_key "patient_forecast_immunizations", "users"
  add_foreign_key "patient_forecast_immunizations", "users", column: "provider_id"
  add_foreign_key "patient_historical_immunizations", "users"
  add_foreign_key "patient_instructions", "encounter_billings"
  add_foreign_key "patient_instructions", "users", column: "creator_id"
  add_foreign_key "patient_insurances", "users"
  add_foreign_key "patient_lists", "users", column: "owner_id"
  add_foreign_key "patient_medications", "users"
  add_foreign_key "patient_ndiis_accounts", "users"
  add_foreign_key "patient_notes", "users"
  add_foreign_key "program_actions", "actions"
  add_foreign_key "program_actions", "programs"
  add_foreign_key "programs", "customers"
  add_foreign_key "provider_action_resources", "actions"
  add_foreign_key "provider_action_resources", "resource_items"
  add_foreign_key "questionnaire_actions", "action_queues"
  add_foreign_key "questionnaire_actions", "questionnaire_submissions"
  add_foreign_key "questionnaire_assignments", "questionnaires"
  add_foreign_key "questionnaire_assignments", "users"
  add_foreign_key "questionnaire_assignments", "users", column: "provider_id"
  add_foreign_key "questionnaire_categories", "customers"
  add_foreign_key "questionnaire_qrs", "customers"
  add_foreign_key "questionnaire_resources", "questionnaires"
  add_foreign_key "questionnaire_resources", "resource_items"
  add_foreign_key "questionnaire_submissions", "questionnaire_assignments"
  add_foreign_key "questionnaire_submissions", "users"
  add_foreign_key "questionnaires", "customers"
  add_foreign_key "questionnaires", "questionnaire_categories"
  add_foreign_key "questionnaires", "resource_items"
  add_foreign_key "questionnaires", "users"
  add_foreign_key "questions", "questionnaires"
  add_foreign_key "synced_accounts", "users"
  add_foreign_key "users", "ltc_facilities"
  add_foreign_key "weight_readings", "users"
  add_foreign_key "weight_readings", "users", column: "created_by_id"
end
