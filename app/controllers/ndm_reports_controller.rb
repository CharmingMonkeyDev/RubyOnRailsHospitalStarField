# frozen_string_literal: true

require 'csv'
require 'open-uri'

class NdmReportsController < ApplicationController
  # before_action :restrict_access_to_reporting_app, only: [:update_data]
  skip_before_action :authenticate_user!, only: [:update_data]
  skip_before_action :verify_authenticity_token, only: [:update_data]
  before_action :authenticate_reporting_app, only: [:update_data]

  include JsonHelper

  def index
    data = NdmReport.where(is_archived: false).order(created_at: 'desc')

    render json: Result.new({ data: data }, "Reports fetched.", true), status: 200
  end

  def show
    ndm_report = NdmReport.find(params[:id])

    render json: Result.new({ ndm_report: ndm_report }, "Ndm Report fetched.", true), status: 200
  end

  def process_reports
    ndm_report = NdmReport.create!(permitted_params)
    validity = validate_headers(params)
    if validity[:valid]
      ProcessNdmReportsJob.perform_later({
        ndm_report_id: ndm_report.id, 
        ndm_providers_file: ndm_report.provider_data.service_url,
        patient_eligibility_file: ndm_report.patient_eligibility_data.service_url,
        drug_claim_file: ndm_report.drug_claim_data.service_url,
        medical_claim_file: ndm_report.medical_claim_data.service_url
      })
    else
      ndm_report.update(status: "invalid", issues: validity[:errors])
    end
    
    render json: Result.new({ message: "success" }, "Reports uploaded and is being processed.", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --NdmReportsController#process_reports")
    render json: Result.new(nil, "Reports upload failed", false), status: 500
  end

  def update_data
    ndm_report  = NdmReport.find(params[:id])
    if ndm_report
      unless params[:errors].nil?
        ndm_report.update(issues: params[:errors], status: "invalid")
      else
        ndm_report.update(data: params[:data], status: "completed")
      end
    end
  end

  def archive
    ndm_report  = NdmReport.find(params[:id])
    ndm_report.update(is_archived: true)
    render json: Result.new({ message: "success" }, "Report archived successfully.", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --NdmReportsController#archive")
    render json: Result.new(nil, "Report archive failed", false), status: 500
  end

  def bulk_patient
    render json: Result.new(nil, "Data can't be blank", false), status: 422 and return if params[:data].blank?

    existing_patients = duplicate_patient_check(params[:data])

    render json: {
      existing_patients: existing_patients
    }, status: 201 and return if existing_patients.present?

    failed_records = []
    params[:data]&.each do |data|
      email = DummyEmail.new().get_email

      original_index = data[:originalIndex]

      result = ProcessPatientCreation.new({
        first_name: data[:first_name],
        last_name: data[:last_name],
        middle_name: data[:middle_name],
        email: email,
        date_of_birth: Date.strptime(data[:dob], "%m/%d/%Y"),
        invited_by_id: current_user.id,
        user_creation_type: "not_invited",
        password: "#{data[:last_name]}Starfield#{Date.strptime(data[:dob], "%m/%d/%Y")}"
      }).call

      if !result.success
        failed_records.push({originalIndex: original_index, error: result.message})
      end
    end

    if failed_records.blank?
      render json: Result.new({ message: "success" }, "Created patients successfully.", true), status: 200
    else
      render json: {
        failed_records: failed_records
      }, status: 201
    end
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e} --NdmReportsController#bulk_patient")
    render json: Result.new(nil, "Create patients failed", false), status: 500
  end

  private
  def permitted_params
    params.permit(:provider_data, :patient_eligibility_data, :drug_claim_data, :medical_claim_data)
  end

  def validate_headers(params)
    errors = []
    
    begin
      provider_actual_headers = CSV.parse(File.read(params[:provider_data].path), headers: true).headers
      if provider_actual_headers.map(&:downcase) != provider_file_expected_headers.map(&:downcase)
        errors << { param: params[:provider_data].original_filename, reason: "Headers do not match file format." }
      end
    rescue StandardError => e
      errors << { param: params[:provider_data].original_filename, reason: "File Corrupt" }
    end

    begin
      patient_file_actual_headers = CSV.parse(File.read(params[:patient_eligibility_data].path), headers: true).headers
      if patient_file_actual_headers.map(&:downcase) != patient_file_expected_headers.map(&:downcase)
        errors << { param: params[:patient_eligibility_data].original_filename, reason:  "Headers do not match file format." }
      end
    rescue StandardError => e
      errors << { param: params[:patient_eligibility_data].original_filename, reason: "File Corrupt" }
    end

    begin
      drug_claim_actual_headers = CSV.parse(File.read(params[:drug_claim_data].path), headers: true).headers
      if drug_claim_actual_headers.map(&:downcase) != drug_claim_expected_headers.map(&:downcase)
        errors << { param: params[:drug_claim_data].original_filename, reason:  "Headers do not match file format." }
      end
    rescue StandardError => e
      errors << { param: params[:drug_claim_data].original_filename, reason: "File Corrupt" }
    end

    begin
      medical_claim_actual_headers = CSV.parse(File.read(params[:medical_claim_data].path), headers: true).headers
      if medical_claim_actual_headers.map(&:downcase) != medical_claim_expected_headers.map(&:downcase)
        errors << { param: params[:medical_claim_data].original_filename, reason:  "Headers do not match file format." }
      end
    rescue StandardError => e
      errors << { param: params[:medical_claim_data].original_filename, reason: "File Corrupt" }
    end

    return {valid: errors.length == 0, errors: errors}
  end

  def provider_file_expected_headers
    return [
      "Provider NPI",
      "Provider Name Last",
      "Provider Name First",
      "Provider Name DBA",
      "Address One",
      "Address Two",
      "Provider Mail City",
      "Provider Mail State Code",
      "Provider Mail Zip Code",
      "Zip Code Extension",
      "Phone Number",
      "County Code",
      "Provider Type Code",
      "Provider Type Desc",
      "Provider Specialty Code",
      "Provider Specialty Desc",
      "Provider License number",
      "Provider Certification num",
      "Provider System ID",
    ]
  end

  def patient_file_expected_headers
    return [
      "Service Month",
      "Medicaid ID",
      "MMIS ID",
      "Current Last Name",
      "Current First Name",
      "Current Middle Name",
      "Gender Desc",
      "Race American Indian",
      "Race Asian",
      "Race African American",
      "Race Hawaiian",
      "Race Unknown",
      "Race White",
      "Date of Birth",
      "County Code",
      "Address Line 1",
      "Address Line 2",
      "City",
      "State Code",
      "Zip Code",
      "Medicaid Eligibility Ind",
      "Medicaid COE code",
      "Medicaid COE code desc",
      "Medicaid Start Date",
      "Medicaid End Date",
      "Medicare Eligibility Ind"
    ]
  end

  def drug_claim_expected_headers
    return [
      "Allowed Amount",
      "Charge Submitted",
      "Dispensing Fee",
      "Copay",
      "Third Party Amount",
      "Out of Pocket Patient Responsibility",
      "Net Paid",
      "Base Amt Source desc",
      "Base Amt Source",
      "Aid Category desc",
      "Aid Category",
      "Compound Indicator",
      "Service Date",
      "Paid Date",
      "Days Supply",
      "RX Refill Number",
      "Living Arrangement Desc",
      "Living Arrangement Code",
      "DAW code",
      "NDC Code",
      "Prescription Number",
      "Authorization ID",
      "Prescribing Prov NPI",
      "Servicing Prov NPI",
      "Recipient MMIS ID",
      "Metric Quantity Dispensed",
      "Recipient Liability",
      "Status Code desc",
      "Claim ID",
      "Line Number",
      "Transaction type desc",
      "Transaction type code",
      "Original Claim ID",
      "Replaced Claim ID",
      "Medicaid eligibility Ind",
      "Prescribing Provider System ID",
      "Servicing Provider System ID",
      "Benefit Plan ID"
    ]
  end

  def medical_claim_expected_headers
    return [
      "CLAIM TYPE DESCRIPTION",
      "Claim Type Code",
      "Recipient MMIS ID",
      "Claim ID",
      "Original Claim ID",
      "Replaced Claim ID",
      "Line Number",
      "Billing Provider NPI",
      "Status Code desc",
      "Claim header status code",
      "Transaction type desc",
      "Transaction type code",
      "Revenue Code",
      "Revenue Code Desc",
      "Surgical procedure code 1",
      "Surgical procedure code 2",
      "Surgical procedure code 3",
      "Surgical procedure code 4",
      "Surgical procedure code 5",
      "Surgical procedure code 6",
      "Procedure Code",
      "Procedure Code Desc",
      "DRG Code Desc",
      "DRG Code",
      "DRG Grouper Version",
      "Diagnosis Code Principal",
      "Diagnosis Code 2",
      "Diagnosis Code 3",
      "Diagnosis Code 4",
      "Diagnosis Code 5",
      "Diagnosis Code 6",
      "Diagnosis Code 7",
      "Diagnosis Code 8",
      "Diagnosis Code 9",
      "Diagnosis Code 10",
      "Diagnosis Code 11",
      "Diagnosis Code 12",
      "Service Date",
      "Last Service Date",
      "COS Desc",
      "Category of Service Code",
      "Net Payment Amount",
      "Medicaid Eligibility Ind",      
    ]
  end

  private

  def duplicate_patient_check(data)
    patients = current_user.get_patients
    existing_patients = []
    data.each do |row|
      original_index = row[:originalIndex]
      patient = patients.find_by(first_name: row[:first_name], last_name: row[:last_name], date_of_birth: Date.strptime(row[:dob], "%m/%d/%Y"))
      
      if patient.present?
        existing_patients.push({originalIndex: original_index, error: "Duplicate name and date of birth"})
      end
    end
    existing_patients
  end

end