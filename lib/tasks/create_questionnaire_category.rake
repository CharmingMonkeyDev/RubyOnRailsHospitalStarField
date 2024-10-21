namespace :create_questionnaire_category do
    # to run this task rails create_questionnaire_category:add_default
    desc "Create or add default questionnaire category"
    task add_default: :environment do
        default_cats = {
            "Asthma": "asthma",
            "COPD": "copd",
            "Depression": "depression",
            "Hypertension": "hypertension"
        }
        default_cats.each do |display_name, db_name|
            QuestionnaireCategory.create(
                display_name: display_name,
                db_name: db_name,
                is_default: true
            )
        end
    end 

end
