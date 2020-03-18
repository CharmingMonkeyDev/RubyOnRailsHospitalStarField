class AdtController < ApplicationController
    def handle_adt_notification_change
        patient = User.find(params[:patient_id])
        if patient.adt_notifications_turned_on
            result = GenerateAdtNotification.new({patient_id: patient.id, requested_by_id: current_user.id, event_reason_code: "I"}).call
        else
            result = GenerateAdtNotification.new({patient_id: patient.id, requested_by_id: current_user.id, event_reason_code: "A"}).call
        end
        render json: result, status: 200
    rescue StandardError => e
        render json: result, status: 500
    end
end
