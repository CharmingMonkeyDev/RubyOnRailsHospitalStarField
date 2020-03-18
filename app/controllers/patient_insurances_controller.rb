require 'securerandom'

# frozen_string_literal: true
class PatientInsurancesController < ApplicationController
    def create
        patient = User.find(params[:patient_id])
        patient_insurance = PatientInsurance.find(params[:patient_insurance_id]) if params[:patient_insurance_id].present?
        user_attributes = permit_params.slice(:first_name, :last_name, :middle_name, :address, :city, :state, :zip)

        if patient_insurance.present?
            patient_insurance.update!(permit_params)
            patient_insurance.insured_user.update!(user_attributes) if patient_insurance.insured_user
        else
            if permit_params[:relationship] == "self"
                insured_user = patient
            else
                password = SecureRandom.base64(10)
                email = SecureRandom.hex(10) + patient.email
                insured_user = User.create!(user_attributes.merge(email: email, password: password))
            end

            patient_insurance = PatientInsurance.create!(permit_params.merge(user_id: patient.id, insured_user: insured_user))

            if permit_params[:is_secondary]
                patient.secondary_patient_insurance_id = patient_insurance.id
                patient.save
            else
                patient.patient_insurance_id = patient_insurance.id
                patient.save
            end
        end
        render json: Result.new(patient_insurance, "Patient Insurance Updated", true), status: 200
    rescue StandardError => e
        render json: Result.new(nil, e, false), status: 500
    end

    def destroy
        if %w[pharmacist health_coach].include?(current_user.role)
            patient = User.find(params[:patient_id])
        else 
            patient = current_user
        end

        secondary_patient_insurance = patient.secondary_patient_insurance
        message = ""
        if secondary_patient_insurance.present?
            secondary_patient_insurance.destroy
            insured_user = secondary_patient_insurance.insured_user
            if insured_user && insured_user.id != patient.id
                insured_user.destroy 
            end
            message = "Patient Insurance Deleted"
        else 
            message = "Patient Insurance Not Found"
            render json: Result.new(nil, message, false), status: 500
        end
        render json: Result.new(nil, message, true), status: 200
        
    rescue StandardError => e
        render json: Result.new(nil, e, false), status: 500
    end    

    private

    def permit_params
        params.require(:patient_insurance).permit(
            :insurance_type,
            :plan_name,
            :insured_id,
            :relationship,
            :insured_name,
            :last_name,
            :middle_name,
            :first_name,
            :insured_dob,
            :address,
            :city,
            :state,
            :zip,
            :county,
            :phone_number,
            :is_secondary
        )
    end
end
