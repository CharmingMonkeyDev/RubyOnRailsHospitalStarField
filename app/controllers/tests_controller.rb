# this is added to test differt stuffs, might use in feature as well
class TestsController < ApplicationController
    skip_before_action :authenticate_user!
    def index
        # ProcessNdiisLink.new({user_id: 29}).call
        # result = ProcessSendChargesChangeHealthcare.new({encounter_billing_id: 9}).call
        # render json: result
        # ProcessNdiisLink.new({user_id: 68}).call
        # ProcessNdiisData.new({user_id: 68}).call
        # TextSms.new("218-790-6564", "ola seniro").send
        # ProcessSqsMessageCreation.new({service_name: "LinkPatientWithNDHIN", user_id: 4}).call
        # ProcessSqsMessageRead.new().call
        # ProcessQSubmissionActionQueue.new({questionnaire_submission_id: 18}).call
        # qs = QuestionnaireSubmission.last
        # url = url_for(qs.signature)
    end
end
