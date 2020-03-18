# frozen_string_literal: true

class SyncedAccountMailer < ApplicationMailer
  default from: ENV['DEFAULT_FROM']

  def glucose_device_syncing(patient)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    attachments.inline['email-head1.png'] = File.read("#{Rails.root}/app/assets/images/email-head1.png")
    mail(to: patient.email, subject: 'Starfield - Disconnected CGM Device') do |format|
      format.html do
        render locals: { patient: patient }
      end
    end
  end
end
