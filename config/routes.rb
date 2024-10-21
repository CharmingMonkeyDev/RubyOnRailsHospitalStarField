# frozen_string_literal: true

Rails.application.routes.draw do
  post "patient_lists/remove_patients", to: "patient_lists#remove_patients"
  get 'patient_medications/index'
  devise_for :users, controllers: {sessions: "users/sessions"}
  root to: 'pages#index'

  # chat routes
  post 'initiate_chat/:channel_id', to: 'chat_channel#initiate_chat'

  # routes related to patient addition, invitation, acceptance and update
  devise_scope :user do
    get   "/check_session_timeout"    => "session_timeout#check_session_timeout"
    get   "/session_timeout"          => "session_timeout#render_timeout"
    get   "/reset_timeout_session"    => "session_timeout#reset_timeout_session"
  end

  # resources routes 
  resources :chat_channel
  resources :user
  resources :patient_actions
  resources :patient_action_groups
  resources :resource_items
  resources :weight_reading
  resources :blood_pressure_reading
  resources :action_pathways
  resources :action_pathway_week_actions
  resources :assigned_actions, except: [:index]
  resources :assigned_pathways
  resources :assigned_pathway_week_actions
  resources :assigned_pathway_weeks
  resources :action_resources
  resources :customer_selections, except: [:destroy]
  resources :customer_users
  resources :provider_customer_users
  resources :customer_user_privileges, only: [:update]
  resources :synced_accounts, only: [:index, :destroy]
  resources :patient_insurances, only: [:create, :destroy]
  resources :chats, only: [:create]
  resources :notes_templates, only: [:index, :create, :edit, :update, :destroy]
  resources :follow_up_dates, only: [:create]
  resources :patient_notes
  resources :chat_notifications, only: [:edit, :update]
  resources :patient_lists, only: [:index, :create, :update, :destroy, :show]
  resources :tests, only: [:index] #this is only used for test purpose
  resources :immunizations, only: [:index, :update]
  resources :board_messages, only: [:index, :create, :destroy]
  resources :customer_permissions, only: [:show, :update]
  resources :ltc_facilities, only: [:create, :update, :destroy]
  resources :ltc_facility_assignments, only: [:create, :update]
  resources :diagnosis_assignments, only: [:create, :destroy]

  # questionnaire routes
  resources :questionnaires
  resources :questionnaire_assignments, only: [:index, :create]
  resources :questionnaire_submissions, only: [:create]
  resources :questionnaire_categories do
    member do
      put "archive", to: "questionnaire_categories#archive"
    end
  end

  # Programs routes
  post "programs/:id/publish", to: "programs#publish"
  put "programs/:id/save_actions_to_db", to: "programs#save_actions_to_db"
  resources :programs

  get "/program_actions/programs/:program_id/actions/:action_id/", to: "program_actions#show"
  resources :program_actions

  resources :company_action_settings, only: [:index, :create]
  put "action_queues/:id/assign_to_provider", to: "action_queues#assign_to_provider"
  put "action_queues/:id/unassign", to: "action_queues#unassign"
  scope '/patients/:patient_id' do
    put "assigned_programs/:id/complete_program", to: "assigned_programs#complete_program"
    put "assigned_provider_actions/:id/complete_action", to: "assigned_provider_actions#complete_action"
    resources :assigned_programs
    resources :assigned_provider_actions
    resources :assignment_histories, only: [:index]
  end

  # Actions
  get "actions_assets", to: "actions#assets", as: "actions_assets" 
  resources :actions
  resources :action_categories do
    member do
      put "archive", to: "action_categories#archive"
    end
  end
  resources :action_step_quick_launches
  resources :action_step_automations
  resources :action_steps
  patch 'actions/:id/archive', to: 'actions#archive'
  post "actions_publish/:id", to: "actions#publish", as: "action_publish"
  
  # Guided questionnaires routes
  resources :guided_questionnaires
  get "guided_questionnaires/:id/select_questionnaires", to: "guided_questionnaires#select_questionnaires"
  get "guided_questionnaires/:id/submissions", to: 'guided_questionnaires#tablet_questionnaire', as: "guided_questionnaire_submissions"
  get "expired_qr", to: 'guided_questionnaires#expired_qr'
  
  get "questionnaires_assets", to: "questionnaires#assets", as: "questionnaires_assets"
  post "questionnaires_publish/:id", to: "questionnaires#publish", as: "questionnaire_publish"
  post "questionnaires_toggle_display_tablet/:id", to: "questionnaires#toggle_display_tablet", as: "questionnaire_toggle_display_tablet"
  get "questionnaire_assignments_assets", to: "questionnaire_assignments#assets", as: "questionnaire_assignments_assets"
  get "questionnaire_assignments_submission/:uuid", to: "questionnaire_assignments#submission", as: "questionnaire_assignments_submission"
  get "questionnaire_assignments_submission_prov/:uuid", to: "questionnaire_assignments#submission_prov", as: "questionnaire_assignments_submission_prov"
  get "questionnaire_submissions_assets/:questionnaire_id", to: "questionnaire_submissions#assets", as: "questionnaire_submissions_assets"
  post "questionnaire_submissions_validate_dob", to: "questionnaire_submissions#validate_dob", as: "questionnaire_submissions_validate_dob"
  get "patients/:patient_id/questionnaire_submissions/:category", to: "questionnaire_submissions#index"

  # customer permission_custom route
  get "get_customer_permissions", to: "customer_permissions#get_customer_permissions", as: "get_customer_permissions"

  # misc routes
  get "patient_assigned_actions/:patient_id", to: "assigned_actions#patient_assigned_actions", as: "patient_assigned_actions"
  get "provider_assigned_actions/:patient_id", to: "assigned_actions#provider_assigned_actions", as: "provider_assigned_actions"
  get "patient_immunizations/:patient_id", to: "immunizations#patient_immunizations", as: "patient_immunizations"
  post "link_to_ndiis/:patient_id", to: "immunizations#link_to_ndiis", as: "link_to_ndiis"
  get "action/:id/resouce_items", to: 'assigned_pathway_week_actions#get_associated_resources'
  post "filter_resource", to: 'resource_items#filter_resource', as: "filter_resource"

  get 'two_factor_auth', to: 'two_factor_auth#new'
  post 'two_factor_auth_update', to: 'two_factor_auth#update'
  post 'invite_patient', to: 'patients#invite_patient'
  post 'add_manual_patient', to: 'patients#add_manual_patient', as: "add_manual_patient"
  post 'patients/convert_patient_to_invited', to: "patients#convert_patient_to_invited", as: "patientconvert_patient_to_invited"
  get 'patient-invite/:invite_token', to: 'patients#patient_invited'
  get 'undo-email/:email_token', to: 'patients#undo_email'
  get 'undo-password/:password_token', to: 'patients#undo_password'
  post 'verify_identity', to: 'patients#verify_identity'
  post 'verify_date_of_birth/:id', to: 'patients#verify_date_of_birth'
  post 'complete_account', to: 'patients#complete_account'
  post 'edit_patient_info', to: 'patients#edit_patient_info'
  post 'undo_patient_email', to: 'patients#undo_patient_email'
  post 'undo_patient_password', to: 'patients#undo_patient_password'
  post 'edit_provider', to: 'providers#edit_provider'

  # routes related to 2fa
  get 'two_factor_auth', to: 'two_factor_auth#new'
  post 'two_factor_auth_update', to: 'two_factor_auth#update'

  # encounter billings routes
  get '/encounters/new', to: 'encounters#new', as: 'encounters_new'
  get '/encounters/list/:patient_id', to: 'encounters#index', as: 'encounters'
  post '/encounters/pend', to: 'encounters#pend', as: 'encounters_pend'
  post '/encounters/add_billing_addendum/:encounter_billing_id', to: 'encounters#add_billing_addendum', as: 'encounters_add_billing_addendum'
  delete '/encounter/:id', to: 'encounters#destroy', as: "encounter"
  get '/encounters/claim_information_assets', to: 'encounters#claim_information_assets', as: "encounters_claim_information_assets"
  get '/encounters/encounter_information_panel_data/:encounter_billing_id', to: 'encounters#encounter_information_panel_data', as: "encounters_encounter_information_panel_data"
  get '/encounters/encounter_notes_panel_data/:encounter_billing_id', to: 'encounters#encounter_notes_panel_data', as: "encounters_encounter_notes_panel_data"
  get '/encounters/patient_instructions_panel_data/:encounter_billing_id', to: 'encounters#patient_instructions_panel_data', as: "patient_instructions_panel_data"
  get '/encounters/patient_and_insurance_panel_data/:encounter_billing_id', to: 'encounters#patient_and_insurance_panel_data', as: "encounters_patient_and_insurance_panel_data"
  get '/encounters/billing1500_panel_data/:encounter_billing_id', to: 'encounters#billing1500_panel_data', as: "billing1500_panel_data"
  get '/encounters/claim_information_panel_data/:encounter_billing_id', to: 'encounters#claim_information_panel_data', as: "claim_information_panel_data"
  get '/encounters/rendering_provider_data/:encounter_billing_id', to: 'encounters#rendering_provider_data', as: "rendering_provider_data"
  get '/encounters/encounter_logs_panel_data/:encounter_billing_id', to: 'encounters#encounter_logs_panel_data', as: "encounter_logs_panel_data"
  post '/encounters/send_charges/:encounter_billing_id', to: 'encounters#send_charges', as: 'encounter_send_charges'
  get '/encounters/previously_used_codes/:user_id', to: 'encounters#previously_used_codes', as: "encounters_previously_used_codes"
  post '/encounters/instructions_pdf', to: 'encounters#instructions_pdf', as: "encounters_test__instructions_pdf"
  post '/encounters/send_instructions_pdf', to: 'encounters#send_instructions_pdf', as: "encounters_send_instructions_pdf"
  
  # medications routes
  get "patient_medications/:patient_id", to: "patient_medications#index", as: "patient_medications"
  delete "patient_medications/:patient_medication_id", to: "patient_medications#destroy"
  post 'add_medication', to: 'patients#add_medication'
  post 'update_medication', to: 'patients#update_medication'
  post 'remove_medication', to: 'patients#remove_medication'
  post 'patient_rpm', to: 'patients#patient_rpm'
  post 'add_blood_glucose', to: 'patient_device_reading#add_blood_glucose'
  post 'update_blood_glucose', to: 'patient_device_reading#update_blood_glucose'
  post 'remove_blood_glucose', to: 'patient_device_reading#remove_blood_glucose'
  post 'action_resources_remove', to: 'action_resources#action_resources_remove'
  post 'patient-upload', to: 'patient_upload#patient_upload'
  get 'ndm-reports', to: 'ndm_reports#index'
  get 'ndm-reports/:id', to: 'ndm_reports#show'
  post 'process-ndm-reports', to: 'ndm_reports#process_reports'
  patch 'ndm-reports/:id/update-data', to: 'ndm_reports#update_data'
  patch 'ndm-reports/:id/archive', to: 'ndm_reports#archive'
  post 'ndm-reports/bulk_patient', to: 'ndm_reports#bulk_patient'
  post 'check_device', to: 'patient_device_reading#check_device'
  post 'medication_search', to: 'patients#medication_search'
  post "resend_customer_user_association_patient/:customer_user_id", to: "customer_users#resend_customer_user_association_patient", as: "resend_customer_user_association_patient"
  post "resend_provider_invitation/:user_id", to: "user#resend_provider_invitation", as: "resend_provider_invitation"
  patch "user/:id/deactivate", to: "user#deactivate"
  patch "user/:id/reactivate", to: "user#reactivate"
  resources :lab_readings, only: [:create, :update]


  # user_privileges route
  post "reset_customer_user_privileges/:user_id", to: 'customer_user_privileges#reset_customer_user_privileges'
  post "clone_customer_user_privileges/:user_id", to: 'customer_user_privileges#clone_customer_user_privileges'
  get "get_oauth_url", to: 'synced_accounts#get_oauth_url'
  get "receive_authorization_from_dexcom", to: 'synced_accounts#receive_authorization_from_dexcom'

  # routes to accept customer invitation(these routes are unauthenticated)
  get "customer_consent_new/:uuid", to: "pages#customer_consent_new", as: "customer_consent_new"
  post "customer_consent_update/:uuid", to: "pages#customer_consent_update", as: "customer_consent_update"

  # adt routes
  post "adt/handle_adt_notification_change", to: "adt#handle_adt_notification_change", as: "handle_adt_notification_change"
  
  # legal routes
  get "legal/terms", to: "legal#terms", as: "terms"
  post "/terms", to: "legal#accept_terms"
  
  
  # datafetching is mostly used for read data routes only
  namespace :data_fetching do
    # assets url
    get 'chats/assets', to: "chats#assets", as: "chats_assets"
    get 'navs/assets', to: "navs#assets", as: "navs_assets"
    
    # patient lab links
    get "get_labs/:patient_id", to: "labs#get_labs", as: "get_labs"
    post "link_with_ndhin/:patient_id", to: "labs#link_with_ndhin", as: "link_with_ndhin"
    
    get "/users/current_user_role", to: "users#current_user_role", as: "current_user_role"
    get "/users/basic_user_info/:user_id", to: "users#basic_user_info", as: "users_basic_user_info"
    get 'my_info/:patient_id', to: 'users#my_info'
    get 'edit_patient_info/:patient_id', to: 'users#edit_patient_info'
    get 'edit_provider/', to: 'users#edit_provider'
    get 'patient_information/:patient_id', to: 'users#patient_information'
    get 'patient_labs/:patient_id', to: 'users#patient_labs'
    get 'lab/:patient_id', to: 'users#lab'
    get 'medications/:patient_id', to: 'users#medications'
    get 'edit_my_info/:patient_id', to: "users#edit_my_info"
    get 'edit_my_email/:patient_id', to: "users#edit_my_email"
    get 'add_action_group_pathway/:user_id', to: "users#add_action_group_pathway"
    get 'care_plan_management/:user_id', to: "users#care_plan_management"
    get 'care_plan/:user_id', to: "users#care_plan"
    get 'add_data/:user_id', to: "users#add_data"
    get 'add_glucose/:user_id', to: "users#add_glucose"
    get 'sync_device/:user_id', to: "users#sync_device"
    get 'app/:user_id', to: "users#app"
    get 'my_data/:user_id', to: "users#my_data"

    get 'action_queues/:id/histories', to: "action_queues#histories"
    get 'global_action_queues', to: "action_queues#global_action_queues"
    get 'action_stats', to: "action_queues#action_stats"
    get 'get_patients_with_unassigned_actions', to: "action_queues#get_patients_with_unassigned_actions"
    get 'get_patients_with_assigned_actions', to: "action_queues#get_patients_with_assigned_actions"
    get 'get_date_range', to: "action_queues#get_date_range"
    get 'get_initial_queue_data', to: "action_queues#get_initial_queue_data" 
    get 'get_provider_list', to: "action_queues#get_provider_list"
    get 'patient_index', to: "users#patient_index", as: "patient_index"
    get 'patient_index_patient_list', to: "users#patient_index_patient_list", as: "patient_index_patient_list"
    post 'update_action_coach', to: "action_queues#update_action_coach"
    post 'update_assigned_actions', to: "action_queues#update_assigned_actions"
    get 'customer_association_index/:user_id', to: "users#customer_association_index", as: "customer_association_index"
    get 'core_team_customer_association_index/:user_id', to: "core_teams#core_team_customer_association_index", as: "core_team_customer_association_index"
    get 'get_user_privileges/:user_id', to: "privileges#get_user_privileges"
    get 'get_providers_chat_new', to: "chats#get_providers_chat_new", as: "get_providers_chat_new"
    post 'chats/initialize_chat', to: "chats#initialize_chat", as: "initialize_chat"
    post 'chats/add_to_chat', to: "chats#add_to_chat"
    post 'chats/archive_chat', to: "chats#archive_chat", as: "archive_chat"
    get 'chats/get_users_without_channel', to: "chats#get_users_without_channel", as: "get_users_without_channel"
    get 'chats/get_channel_between/:user_id', to: "chats#get_channel_between", as: "get_channel_between"
    get 'chats/get_token', to: "chats#get_token", as: "get_chat_token"
    get "patient_users", to: "users#get_patients"
    get "ltc_facilities/assigned", to: "ltc_facilities#assigned_ltc_facility"
    get "ltc_facilities/history", to: "ltc_facilities#ltc_history"
    get "ltc_facilities", to: "ltc_facilities#index"
    get "diagnoses/assigned", to: "diagnoses#assigned_diagnoses"
    get "diagnoses/history", to: "diagnoses#diagnosis_history"
    get 'programs', to: 'programs#index'

    # insurance objects
    get 'patient_insurances/:patient_id', to: "patient_insurances#index", as: "patient_information"
    
    # other data fetching resource routes
    resources :customers
    resources :action_queues, only: [:index]
    resources :core_teams, only: [:index, :show]
    resources :chats, only: [:index]
    resources :adt_notifications, only: [:index]
    resources :notes_templates, only: [:index, :show]
  end
  
  # reports related to patients
  namespace :reports do
    get "reports/navigation_data/:patient_id", to: "reports#navigation_data", as: "reports_navigation_data"
    get "provider_actions_data", to: 'reports#provider_actions_data', as: "reports_provider_actions_data"
    get "provider_actions/generate_csv", to: "reports#provider_actions_csv_export"
    get "reports_patient_information/:patient_id", to: "patients#patient_information", as: "reports_patient_information"
    get "reports_patient_information_assets", to: "patients#patient_information_assets", as: "reports_patient_information_assets"
    get "cgm_reports_glucose_exposure/:patient_id", to: "cgm_reports#glucose_exposure", as: "cgm_reports_glucose_exposure"
    get "cgm_reports_glucose_variability/:patient_id", to: "cgm_reports#glucose_variability", as: "cgm_reports_glucose_variability"
    get "cgm_reports_glucose_ranges/:patient_id", to: "cgm_reports#glucose_ranges", as: "cgm_reports_glucose_ranges"
    get "cgm_reports_ambulatory_report_daily/:patient_id", to: "cgm_reports#ambulatory_report_daily", as: "cgm_reports_ambulatory_report_daily"
    get "cgm_reports_ambulatory_report_weekly/:patient_id", to: "cgm_reports#ambulatory_report_weekly", as: "cgm_reports_ambulatory_report_weekly"
    get "cgm_reports_get_date_range/:patient_id", to: "cgm_reports#get_date_range", as: "cgm_reports_get_date_range"
    get "user_data/:patient_id/readings", to: "user_data#readings"
  end
  
  # reports routes for admin and business
  namespace :admin do 
    namespace :reports do 
      get "adt_discharge/action_panel_data", to: "adt_discharge#action_panel_data", as: "adt_discharge_action_panel_data"
      get "adt_discharge/action_panel_generate_csv", to: "adt_discharge#action_panel_csv_export"
      get "adt_discharge/assets", to: "adt_discharge#assets", as: "adt_discharge_assets"
      get "im_forecasts/report_data", to: "im_forecasts#report_data", as: "im_forecast_report_data"
      get "im_forecasts/assets", to: "im_forecasts#assets", as: "im_forecast_assets"
      get "im_forecasts/generate_csv", to: "im_forecasts#generate_csv", as: "im_forecast_generate_csv"
      get "vax_aggregate/assets", to: "vax_aggregate#assets"
      get "vax_aggregate/report_data", to: "vax_aggregate#report_data"
      get "vax_aggregate/generate_csv", to: "vax_aggregate#generate_csv"
      get "encounter_detail/report_data", to: "encounter_detail#report_data"
      get "encounter_detail/assets", to: "encounter_detail#assets"
      get "encounter_detail/generate_csv", to: "encounter_detail#generate_csv"
      get "patient_demographics/assets", to: "patient_demographics#assets"
      get "patient_demographics/report_data", to: "patient_demographics#report_data"
      get "patient_demographics/generate_csv", to: "patient_demographics#generate_csv"
    end
  end
  
  # misc routes
  get "/feature_flags", to: "pages#feature_flags", as: "feature_flags"
  post "reset_customer_user_privileges/:user_id", to: 'customer_user_privileges#reset_customer_user_privileges'
  get "get_oauth_url", to: 'synced_accounts#get_oauth_url'
  get "receive_authorization_from_dexcom", to: 'synced_accounts#receive_authorization_from_dexcom'
  post "webhooks/get_stream", to: "webhooks#get_stream"
  get 'sync_device_status/:user_id', to: "synced_accounts#check_glucose_device_syncing"
  
match '*path', to: 'pages#index', via: :all, constraints: ->(request) { request.format != :pdf && !request.path.include?('rails/active_storage') }
end