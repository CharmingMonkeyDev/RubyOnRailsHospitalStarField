# frozen_string_literal: true

class InvitePatientMailer < ApplicationMailer
  default from: ENV['DEFAULT_FROM']

  def invite_patient(user)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    attachments.inline['email-head1.png'] = File.read("#{Rails.root}/app/assets/images/email-head1.png")
    attachments.inline['email-head2.png'] = File.read("#{Rails.root}/app/assets/images/email-head2.png")
    attachments.inline['email-getstarted.png'] = File.read("#{Rails.root}/app/assets/images/email-getstarted.png")
    mail(to: user.email, subject: 'You have been invited to Starfield') do |format|
      format.html do
        render locals: { patient: user }
      end
    end
  end

  def welcome_patient(user)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    attachments.inline['email-head3.png'] = File.read("#{Rails.root}/app/assets/images/email-head3.png")
    attachments.inline['email-head4.png'] = File.read("#{Rails.root}/app/assets/images/email-head4.png")
    attachments.inline['email-head5.png'] = File.read("#{Rails.root}/app/assets/images/email-head5.png")
    attachments.inline['email-head6.png'] = File.read("#{Rails.root}/app/assets/images/email-head6.png")
    mail(to: user.email, subject: 'Welcome to Starfield') do |format|
      format.html do
        render locals: { patient: user }
      end
    end
  end
end
