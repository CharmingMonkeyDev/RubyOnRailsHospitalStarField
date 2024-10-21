class PatientListsController < ApplicationController  

  def index
    log_info("User ID #{current_user&.id} calling --PatientListsController::index")

    patient_lists = current_user.patient_lists
    list_with_count = []

    patient_lists.each do |patient_list|
      count = patient_list.patients.length
      list_with_count << patient_list.attributes.merge(count: count)
    end

    result = {
      patient_lists: list_with_count
    }    
    render json: result, status: 200
  rescue StandardError => e   
    log_errors(e)
    render json: Result.new(nil, "Error on data fetch", false), status: 500  
  end

  def create 
    log_info("User ID #{current_user&.id} creating PatientList --PatientListsController::create")
    if current_user.is_provider?
      PatientList.transaction do 
        if(params[:patient_list_id].present?)
          @patient_list = current_user.patient_lists.find(params[:patient_list_id])
        else 
          @patient_list = PatientList.create!(name: params[:name], owner: current_user)
        end
        if params[:pending_add_ids]
          patients = current_user.get_patients.where(id: params[:pending_add_ids])
          @patient_list.patients << patients
          @patient_list.save!
        end
        if params[:pending_removal_ids]
          patients = @patient_list.patients.where(id: params[:pending_removal_ids])
          @patient_list.patients.delete(patients) 
          @patient_list.save!
        end
      end
      result = {
          patient_list: @patient_list
      }
      render json: result, status: 200
    else 
      render json: Result.new(nil, "Insufficient privileges", false), status: 500
    end
  rescue StandardError => e   
    log_errors(e)
    render json: Result.new(nil, "Error on data fetch", false), status: 500  
  end

  def show
    log_info("User ID #{current_user&.id} calling --PatientListsController::show")
    patient_list = current_user.patient_lists.find(params[:id])
    formatted_patients = []
    patient_list.patients.each do |patient|
      formatted_patients << patient.attributes.merge(
        programs: patient.programs.pluck(:title).join(', '),
        insurance_type: patient.patient_insurance&.insurance_type,
        ltc_facility: patient.assigned_facility&.name,
        assigned_diagnoses: patient.assigned_diagnoses.map { |d| "#{d.diagnosis_code_desc} (#{d.diagnosis_code_value})" }.join(', ')
      )
    end

    result = {
      patient_list: patient_list,
      patients: formatted_patients
    }    
    render json: result, status: 200
  rescue StandardError => e   
    log_errors(e)
    render json: Result.new(nil, "Error on data fetch", false), status: 500  
  end

  def update 
    log_info("User ID #{current_user&.id} creating PatientList --PatientListsController::update")

    if current_user.is_provider?
      patient_list = current_user.patient_lists.find(params[:patient_list_id])
      patients = User.where(id: params[:patient_ids])      

      # add patient if not already on the list
      patients.each do |patient| 
        unless patient_list.patients.exists?(id: patient.id)
          patient_list.patients << patient 
        end 
      end 

      result = {
          patient_list: patient_list,
          patients: patient_list.patients,
      }
      render json: result, status: 200
    else 
      render json: Result.new(nil, "Insufficient privileges", false), status: 500
    end
  rescue StandardError => e   
      log_errors(e)
      render json: Result.new(nil, "Error on data fetch", false), status: 500  
  end

  def remove_patients    
    log_info("User ID #{current_user&.id} creating PatientList --PatientListsController::remove_patients")

    if current_user.is_provider?
      patient_list = current_user.patient_lists.find(params[:patient_list_id])
      patients = User.where(id: params[:patient_ids])
      patient_list.patients.delete(patients)
      result = {
          patient_list: patient_list,
          patients: patient_list.patients,
      }
      render json: result, status: 200
    else 
      render json: Result.new(nil, "Insufficient privileges", false), status: 500
    end
  rescue StandardError => e   
    log_errors(e)
    render json: Result.new(nil, "Error on data fetch", false), status: 500  
  end

  def destroy
    log_info("User ID #{current_user&.id} creating PatientList --PatientListsController::destroy")

    if current_user.is_provider?
      patient_list = current_user.patient_lists.find(params[:id])
      patient_list.destroy
      result = {
          patient_list: patient_list,
      }
      render json: result, status: 200
    else 
      render json: Result.new(nil, "Insufficient privileges", false), status: 500
    end
  rescue StandardError => e   
    log_errors(e)
    render json: Result.new(nil, "Error on data fetch", false), status: 500
  end 
end
