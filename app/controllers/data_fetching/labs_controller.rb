include PatientDataHelper

class DataFetching::LabsController < ApplicationController
    skip_before_action :authenticate_user!  #TODO should this be authenticated?

    def get_labs
        # this is similar method to data_fetching:users_controller:: get_labs
        user = User.find(params[:patient_id])
        patient_identifier = user.patient_identifier
        if patient_identifier.present?
            patient_report = NdhinData.new.get_diagnostic_report(patient_identifier)
        end
        tc_data_values = (patient_report ? get_report_value(patient_report, 'TRIGLYCERIDE') : []) + user.lab_readings.by_type("tc").latest()
        hdl_data_values = patient_report ? get_report_value(patient_report, 'HDL') : [] + user.lab_readings.by_type("hdl").latest()
        hgb_data_values = patient_report ? get_report_value(patient_report, 'A1C') : [] + user.lab_readings.by_type("a1c").latest()

        result = {
            tc_values: tc_data_values,
            hdl_values: hdl_data_values,
            hgb_data_values: hgb_data_values,
            bp_values: user.blood_pressure_readings,
        }
        log_info("User ID #{current_user&.id} accessed patient labs for user ID #{user&.id} --DataFetching::LabsController::get_labs")
        render json: Result.new(result, "Labs Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::LabsController#get_labs")
        render json: Result.new(nil, e, false), status: 500
    end

    def link_with_ndhin
        patient = User.find(params[:patient_id])
        patient_identifier = NdhinData.new.get_ndhin_patient_indentifier(patient)
        if patient_identifier.present?
            patient.update(patient_identifier: patient_identifier)
            GenerateAdtNotification.new({patient_id: patient.id, requested_by_id: current_user.id, event_reason_code: "A"}).call
            log_info("User ID #{current_user&.id} updated patient_identifier #{patient&.id} --DataFetching::LabsController::link_with_ndhin")
            render json: Result.new(nil, "Patient linked with NDHIN", true), status: 200
        else
            render json: Result.new(nil, "Patient cannot be linked with NDHIN", true), status: 200
        end
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --DataFetching::LabsController#link_with_ndhin")
        render json: Result.new(nil, e, false), status: 500
    end
end
