class DataFetching::PatientInsurancesController < ApplicationController
    def index
        user = current_user
        patient = User.find(params[:patient_id])
        patient_insurance = patient.patient_insurance
        secondary_patient_insurance = patient.secondary_patient_insurance

        basic_patient_info = {
            insuredSex:  patient.gender&.downcase,
            insuredPhoneNumber: patient.mobile_phone_number
        }
        return_obj = {
            patient_insurance: patient_insurance,
            secondary_patient_insurance: secondary_patient_insurance,
            insurance_types: PatientInsuranceType.where(display_on_ui: true).order(:sort_order),
            basic_patient_info: basic_patient_info
        }
        render json: Result.new(return_obj, "Patient Insurance Fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --DataFetching::PatientInsurancesController::index")
        render json: Result.new(nil, e, false), status: 500
    end

end
