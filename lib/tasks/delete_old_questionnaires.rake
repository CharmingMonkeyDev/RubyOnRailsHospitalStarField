# TODO this is a one off rake task which can be deleted after use
task delete_old_questionnaires: :environment do
  ActionStepAutomation.where.not(questionnaire_id:nil).destroy_all
  ActionStepQuickLaunch.where.not(questionnaire_id:nil).destroy_all

  Questionnaire.find_each do |questionnaire|
    questionnaire.questionnaire_assignments.each do |assignment|
      QuestionnaireSubmission.where(questionnaire_assignment_id: assignment.id).destroy_all
    end
    questionnaire.questionnaire_assignments.destroy_all
    questionnaire.destroy
  end
end