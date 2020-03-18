# frozen_string_literal: true

class ChatMailer < ApplicationMailer
  default from: ENV['DEFAULT_FROM']

  def missed_messages(patient)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    attachments.inline['email-head7.png'] = File.read("#{Rails.root}/app/assets/images/email-head7.png")
    mail(to: patient.email, subject: 'Starfield - Missed Chat Messages') do |format|
      format.html do
        render locals: { patient: patient }
      end
    end
  end
end
