class PatientNotesController < ApplicationController

    def index
        patient = current_user.get_patients.find(params[:patient_id])
        patient_notes = patient.patient_notes.order(created_at: :desc)
        render json: Result.new(patient_notes, "Patient notes fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --PatientNotesController#index")
        render json: Result.new(nil, "Patient notes are not fetched", false), status: 500
    end

    def show
        patient_ids = current_user.get_patients.ids
        patient_note = PatientNote.where(user_id: patient_ids, id: params[:id]).first
        render json: Result.new(patient_note, "Patient notes fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --PatientNotesController#show")
        render json: Result.new(nil, "Patient notes are not fetched", false), status: 500
    end

    def create
        patient = current_user.get_patients.find(permit_params[:user_id])
        patient_note = patient.patient_notes.create!(permit_params)
        render json: Result.new(patient_note, "Patient note created", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --PatientNotesController#create")
        render json: Result.new(nil, "Patient Note is not created", false), status: 500
    end

    def update
        patient_ids = current_user.get_patients.ids
        patient_note = PatientNote.where(user_id: patient_ids, id: params[:id]).first
        patient_note.update(permit_params)
        render json: Result.new(patient_note, "Patient note updated", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --PatientNotesController#update")
        render json: Result.new(nil, "Patient Note is not updated", false), status: 500
    end

    def destroy
        patient_ids = current_user.get_patients.ids
        patient_note = PatientNote.where(user_id: patient_ids, id: params[:id]).first
        patient_note.destroy
        render json: Result.new(patient_note, "Patient note deleted", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --PatientNotesController#destroy")
        render json: Result.new(nil, "Patient Note is not deleted", false), status: 500
    end

    private

    def permit_params
       params.require(:patient_note).permit(:user_id, :note)
    end
end
