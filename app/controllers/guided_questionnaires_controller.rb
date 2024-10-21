class GuidedQuestionnairesController < ApplicationController
    skip_before_action :authenticate_user!, except: [:create]
    before_action :decode_jwt, only: [:tablet_questionnaire, :show]
    before_action :check_qr, except: [:create, :expired_qr]

    def show
        # checking if qr is older than 5 mins
        expiry_time = ENV["QR_CODE_EXPIRY_TIME"] ? ENV["QR_CODE_EXPIRY_TIME"].to_i.minutes : 5.minutes
        if @qr.created_at < expiry_time.ago
            flash[:alert] = "The link has expired"
            redirect_to expired_qr_path(id: @qr.uuid)
            return
        end
        
        # checking if the qr is most recent assignment or not
        @patient = @qr.patient
        most_recent_qr = @patient.questionnaire_qrs.order(created_at: :desc).first

        if most_recent_qr.uuid != params[:id]
            flash[:alert] = "The qr is invalid"
            redirect_to expired_qr_path(id: @qr.uuid)
            return
        end

        # Get categories
        questionnaires_categorie_names = @qr.customer.questionnaires.display_on_tablet.pluck(:category).uniq
        categories = QuestionnaireCategory.where(db_name: questionnaires_categorie_names)

        @ordered_categories = categories.map do |category|
            category
        end
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        respond_to do |format|
            format.html { render :show }
            format.json { render json: Result.new({patient: @qr.patient, customer: @qr.customer}, "QR found", true), status: 200 }
        end
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --GuidedQuestionnairesController#create")
        render json: Result.new(nil, "QR cannot be found", false), status: 500
    end

    def expired_qr
        uuid = params[:id]
        qr = QuestionnaireQr.where(uuid: uuid).first
        qr&.update(is_valid: false)
        respond_to do |format|
            format.html { render :expired_qr }
            format.json { render json: Result.new(nil, "QR expired", true), status: 200 }
        end
    end


    def select_questionnaires
        @selected_categories = QuestionnaireCategory.where(id: params[:selected_categories].split(",").map(&:to_i))
                                                    # .joins(:questionnaires)
        @selected_categories = @selected_categories.reject { |category| category.questionnaires.empty?}
        
        @selected_json = @selected_categories.each do |category|
            cat_json = category.as_json
            cat_json["questionnaires"] = category.questionnaires.where(display_on_tablet: true).select do |questionnaire|
                (questionnaire.customer_id == category.customer_id) && questionnaire.display_on_tablet
            end
            category
        end
 
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    end

    def tablet_questionnaire
        @patient = User.find_by(id: @payload['patient_id']) if @payload

        unless @patient.present?
            flash[:alert] = "The patient can't be found"
            redirect_to expired_qr_path
            return
        end

        questionnaires = Questionnaire.where(id: params[:selected_questionnaires].split(","))
        assignments = []

        questionnaires.each do |questionnaire|
            assignments << QuestionnaireAssignment.create(
                user_id: @patient.id,
                provider_id: @qr.assigned_by_id,
                questionnaire_id: questionnaire.id,
                assignment_type: "manual",
                expiration_date: 20.minutes.from_now,
                submission_status: "pending"
            ) 
        end

        @selected_questionnaires = QuestionnaireAssignment.where(id: assignments.pluck(:id))
            .joins(:questionnaire)
            .select('questionnaire_assignments.*, questionnaires.name as questionnaire_name')
    end

    def create
        selected_customer = current_user.customer_selection.customer
        patient_id = params[:patient_id]
        qr = QuestionnaireQr.create(
            customer_id: selected_customer.id,
            patient_id: patient_id,
            assigned_by_id: current_user.id,
            is_valid: true
        )
        # we need to reload because uuid wont be assigned on create
        qr = QuestionnaireQr.find(qr.id)
        root_url = Rails.application.routes.url_helpers.root_url
        url = "#{root_url}guided_questionnaires/#{qr.uuid}"

        payload = {
            customer_id: selected_customer.id,
            patient_id: patient_id,
            qr: qr.id
        }
        jwt = JwtService.new(payload: payload).encode
        url = "#{url}?token=#{jwt}"

        render json: Result.new(url, "QR created", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --GuidedQuestionnairesController#create")
        render json: Result.new(nil, "QR cannot be created", false), status: 500
    end
    
    private

    def decode_jwt
        jwt_token = params[:token]
        redirect_to expired_qr_path and return if jwt_token.blank?
        @payload = nil 
        begin
            @payload = JwtService.new(jwt_token: jwt_token).decode&.first
        rescue JWT::ExpiredSignature, JWT::VerificationError  => err
            flash[:alert] = "The link has expired"
            redirect_to expired_qr_path
            return
        end
    end

    def check_qr
        uuid = params[:id]
        @qr = QuestionnaireQr.where(uuid: uuid, is_valid: true).first

        unless @qr.present?
            flash[:alert] = "The qr is invalid"
            redirect_to expired_qr_path
            return
        end
    end 
end
