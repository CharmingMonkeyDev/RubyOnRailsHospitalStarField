# frozen_string_literal: true
class DataFetching::NavsController < ApplicationController
    def assets
        result = {
            nav_patients_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_patients_icon.png'),
            nav_patient_lists_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_patient_lists_icon.png'),
            nav_add_patient_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_add_patient_icon.png'),
            nav_care_plan_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_care_plan_icon.png'),
            nav_hie_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_hie_icon.png'),
            nav_queue_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_queue_icon.png'),
            nav_settings_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_settings_icon.png'),
            nav_catalog_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_catalog_icon.png'),
            nav_customers_icon: ActionController::Base.helpers.asset_url('nav_icons/nav_customers_icon.png'),
            providers_icon_with_label_inactive: ActionController::Base.helpers.asset_url('providers_inactive.png'),
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --DataFetching::NavsController::assets")
        render json: Result.new(nil, e, false), status: 500
    end
end
