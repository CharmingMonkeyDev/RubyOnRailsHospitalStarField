# frozen_string_literal: true

require 'net/sftp'

namespace :fetch do
  task ndiis_forecast: :environment do
   
    ndiis_linked_users = User.joins(:patient_ndiis_account).distinct
    ndiis_linked_users.each do |user|
        ProcessNdiisData.new({user_id: user.id}).call
    end
  end
end
