# frozen_string_literal: true

class PatientsController < ApplicationController
  before_action :authenticate_user!,
                except: %i[patient_invited verify_identity complete_account verify_date_of_birth undo_email undo_patient_email
                           undo_password undo_patient_password]
  before_action :verify_two_factor,
                except: %i[patient_invited verify_identity complete_account verify_date_of_birth undo_email undo_patient_email
                           undo_password undo_patient_password]
  include JsonHelper
  include ChannelHelper
  include MedicationHelper

  def invite_patient
    result = ProcessPatientCreation.new({
      first_name: user_strong_params[:first_name],
      last_name: user_strong_params[:last_name],
      middle_name: user_strong_params[:middle_name],
      email: user_strong_params[:email],
      date_of_birth: user_strong_params[:date_of_birth],
      invited_by_id: current_user.id,
      user_creation_type: "invited",
    }).call
    if result.success?
      flash[:notice] = result.message
      log_info("User#{current_user&.id} invited user ID #{result&.resource&.id} and assigned default privileges --PatientsController::invite_patient")
      json_response('Patient Invited', 200)
    else
      flash[:notice] = result.message
      log_info("User#{current_user&.id} failed to invite user --PatientsController::invite_patient")
      json_response(result.message, 500)
    end
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::invite_patient")
    json_response(e, 500)
  end

  def add_manual_patient
    more_params = {
      user_creation_type: "not_invited",
      invited_by_id: current_user.id
    }

    if manual_patient_params[:no_email]
      more_params[:email] = DummyEmail.new().get_email
    end
    result = ProcessPatientCreation.new(manual_patient_params.merge(more_params)).call
    if result.success
      return render json: Result.new(result, "Patient added to the app.", true), status: 200
    else
      return render json: Result.new(result, "Something went wrong.", true), status: 500
    end    
    rescue StandardError => e
      render json: Result.new(nil, e, false), status: 500
  end

  def patient_invited
    @patient = User.where(invite_token: params[:invite_token]).first
  end

  def undo_email
    @patient = User.where(email_update_token: params[:email_token]).first
  end

  def undo_password
    @patient = User.where(password_update_token: params[:password_token]).first
  end

  def verify_identity
    patient = User.where(invite_token: invite_strong_params[:invite_token]).first
    check_date = Date.parse(invite_strong_params[:date_of_birth])

    log_info("User verified indetity user ID #{patient&.id} --PatientsController::verify_identity")
    if patient.date_of_birth.strftime('%Y-%m-%d').to_s == check_date.to_s
      json_response('Identity Verified',
                    200)
    else
      json_response(
        'Identity not verified, date does not match our records', 500
      )
    end
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::verify_identity")
    json_response(e, 500)
  end

  def verify_date_of_birth
    patient = User.find(params[:id])
    check_date = Date.parse(invite_strong_params[:date_of_birth])

    log_info("User date of birth verified user ID #{patient&.id} --PatientsController::verify_date_of_birth")
    if patient.date_of_birth.strftime('%Y-%m-%d').to_s == check_date.to_s
      json_response('Identity Verified', 200)
    else
      json_response(
        'Identity not verified, date does not match our records', 500
      )
    end
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::verify_date_of_birth")
    json_response(e, 500)
  end

  def complete_account
    patient = User.where(invite_token: complete_strong_params[:invite_token]).first

    unless patient.present?
      flash[:notice] = "Could not find the user"
      json_response('Could not find the user', 500)
      return
    end

    result = ProcessPatientAcceptInvitation.new({
      user_id: patient.id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      middle_name: patient.middle_name,
      address: complete_strong_params[:address],
      city: complete_strong_params[:city],
      state: complete_strong_params[:state],
      zip: complete_strong_params[:zip],
      mobile_phone_number: complete_strong_params[:mobile_phone_number],
      gender: complete_strong_params[:gender],
      email: complete_strong_params[:email],
      password: complete_strong_params[:password],
      
    }).call
    if result.success?
      flash[:notice] = result.message
      log_info("User ID #{patient&.id} completed account setup --PatientsController::complete_account ")
      customer_user = result.resource.customer_users.where(status: "pending").first
      json_data_response({ uuid: result&.resource&.uuid, customer_user_id: customer_user&.id })
    else
      flash[:notice] = result.message
      log_info("User ID #{patient&.id} cannot completed account setup --PatientsController::complete_account ")
      msg = result.message || 'Account Incomplete'
      json_response(msg, 500)
    end
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::complete_account")
    Rails.logger.error {e}
    Rails.logger.error {e.backtrace.join("\n")}
    json_response(e, 500)
  end

  def edit_patient_info
    if current_user.is_patient? 
      patient = current_user
    else       
      patient = current_user.get_patients&.find_by_id(edit_strong_params[:id])
    end 

    if patient.nil? 
      Rollbar.warning("Error: Unauthorized access --PatientsController::edit_patient_info.  Current user #{current_user.id}, editing info for patient #{edit_strong_params[:id]}")
      json_response(e, 500)
      return
    end 

    previous_email = patient.email
    patient.update!(edit_strong_params)

    if edit_strong_params[:password].present?
      password_token = Digest::SHA1.hexdigest("#{patient.email}#{DateTime.now}")
      patient.update!(password_update_token: password_token)
      PatientProfileMailer.password_updated(patient, password_token).deliver
    elsif current_user.id == edit_strong_params[:id].to_i && edit_strong_params[:email].present?
      email_token = Digest::SHA1.hexdigest("#{patient.email}#{DateTime.now}")
      patient.update!(email_update_token: email_token)
      PatientProfileMailer.profile_updated(patient, previous_email, email_token).deliver
    end
    log_info("User ID #{current_user&.id} updated User information for User ID #{patient&.id} --PatientsController::edit_patient_info")
    json_response('Patient Updated', 200)
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::edit_patient_info")
    json_response(e, 500)
  end

  def undo_patient_email
    patient = User.find_by_id(edit_strong_params[:id])
    previous_email = patient.email
    patient.update!(email: edit_strong_params[:email], email_update_token: nil)

    email_token = Digest::SHA1.hexdigest("#{patient.email}#{DateTime.now}")
    patient.update!(email_update_token: email_token)
    PatientProfileMailer.profile_updated(patient, previous_email, email_token).deliver

    flash[:notice] = "#{patient.name} email address has been updated."
    log_info("User ID #{patient&.id} updated patient information --PatientsController::undo_patient_email")
    json_response('Patient Updated', 200)
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::undo_patient_email")
    json_response(e, 500)
  end

  def undo_patient_password
    patient = User.find_by_id(edit_strong_params[:id])
    patient.update!(password: edit_strong_params[:password], password_update_token: nil)

    password_token = Digest::SHA1.hexdigest("#{patient.email}#{DateTime.now}")
    patient.update!(password_update_token: password_token)
    PatientProfileMailer.password_updated(patient, password_token).deliver

    flash[:notice] = "#{patient.name} password has been updated."
    log_info("User ID #{patient&.id} updated patient information --PatientsController::undo_patient_password")
    json_response('Patient Email Updated', 200)
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::undo_patient_password")
    json_response(e, 500)
  end

  def add_medication
    medication = PatientMedication.create!(medication_strong_params)

    flash[:notice] = "The medication has been added for: #{medication.user.name}"
    log_info("User ID #{current_user&.id} added PatientMedication ID #{medication&.id} --PatientsController::add_medication")
    json_response('Medication Added', 200)
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::add_medication")
    json_response(e, 500)
  end

  def update_medication
    medication = PatientMedication.find_by_id(medication_strong_params[:id])
    medication.update!(medication_strong_params)

    flash[:notice] = "The medication has been updated for: #{medication.user.name}"
    log_info("User ID #{current_user&.id} updated PatientMedication ID #{medication&.id} --PatientsController::update_medication")
    json_response('Medication Updated', 200)
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::update_medication")
    json_response(e, 500)
  end

  def remove_medication
    reading = PatientMedication.find_by_id(params[:medication][:patient_medication_id])
    log_info("User ID #{current_user&.id} destroyed PatientMedication ID #{reading&.id} --PatientsController::remove_medication")
    reading.destroy

    flash[:notice] = 'The medication has been removed.'
    json_response('Medication Removed', 200)
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::remove_medication")
    json_response(e, 500)
  end

  def patient_rpm
    patient = User.find_by_id(params[:user][:id])
    patient_device = patient.patient_device
    log_info("User ID #{current_user&.id} accessed UserObject and patientDevice for user ID #{patient&.id} --PatientsController::patient_rpm")
    json_data_response({ patient: patient, patient_device: patient_device })
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::patient_rpm")
    json_response(e, 500)
  end

  def medication_search
    results = search_rxnorm(medication_search_strong_params[:name])
    log_info("rxnorm searched")
    json_data_response({ results: results })
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::medication_search")
    json_response(e, 500)
  end

  def convert_patient_to_invited
    patient = User.find(params[:user_id])
    if patient
      result = ConvertPatientToInvited.new(patient_id: patient.id).call
      if result.success?
        render json: result, status: 200
      else
        render json: result, status: 500
      end
    end
  rescue StandardError => e
    Rollbar.warning("Error: #{e} --PatientsController::convert_patient_to_invited")
    render json: Result.new(nil, "Cannot Convert the patient", false), status: 500
  end

  private

  def note_strong_params
    permited_params = %i[user_id value note_type]
    params.require(:note).permit(permited_params)
  end

  def medication_strong_params
    permited_params = %i[user_id name value id created_at]
    params.require(:medication).permit(permited_params)
  end

  def user_strong_params
    permited_params = %i[email first_name middle_name last_name date_of_birth]
    params.require(:user).permit(permited_params)
  end

  def invite_strong_params
    permited_params = %i[date_of_birth invite_token]
    params.require(:user).permit(permited_params)
  end

  def complete_strong_params
    permited_params = %i[first_name middle_name last_name email password invite_token address city state zip mobile_phone_number gender]
    params.require(:user).permit(permited_params)
  end

  def edit_strong_params
    if current_user.is_patient? 
      permited_params = %i[email address city state zip mobile_phone_number gender id password]
    else 
      permited_params = %i[
        first_name 
        middle_name 
        last_name 
        email 
        address 
        city 
        state 
        zip 
        county 
        race 
        ethnicity 
        mobile_phone_number 
        gender 
        id 
        date_of_birth 
        password
      ]
    end 
    params.require(:user).permit(permited_params)
  end

  def medication_search_strong_params
    permited_params = %i[name]
    params.require(:medication).permit(permited_params)
  end

  def manual_patient_params
    params.require(:patient).permit(
      :first_name,
      :middle_name,
      :last_name,
      :date_of_birth,
      :mobile_phone_number,
      :email,
      :no_email,
      :gender,
      :address,
      :city,
      :state,
      :zip
    )
  end
end
