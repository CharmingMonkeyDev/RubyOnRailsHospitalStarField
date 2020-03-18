# frozen_string_literal: true

class PatientProfileMailer < ApplicationMailer
  default from: ENV['DEFAULT_FROM']

  def profile_updated(patient, _previous_email, email_token)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    attachments.inline['email-head9.png'] = File.read("#{Rails.root}/app/assets/images/email-head9.png")
    attachments.inline['email-email.png'] = File.read("#{Rails.root}/app/assets/images/email-email.png")
    mail(to: patient.email, subject: 'Starfield - Patient Email Address Updated') do |format|
      format.html do
        render locals: { patient: patient, email_token: email_token }
      end
    end
  end

  def password_updated(patient, password_token)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    attachments.inline['email-head8.png'] = File.read("#{Rails.root}/app/assets/images/email-head8.png")
    attachments.inline['email-password.png'] = File.read("#{Rails.root}/app/assets/images/email-password.png")
    mail(to: patient.email, subject: 'Starfield - Patient Password Updated') do |format|
      format.html do
        render locals: { patient: patient, password_token: password_token }
      end
    end
  end

  def new_patient_customer_association(user_id, customer_user_id)
    user = User.find(user_id)
    customer_user = CustomerUser.find(customer_user_id)
    attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
    mail(to: user.email, subject: 'Starfield - New Customer Association') do |format|
      format.html do
        render locals: { user: user, customer_user: customer_user }
      end
    end
  end
end
