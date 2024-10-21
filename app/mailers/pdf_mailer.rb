class PdfMailer < ApplicationMailer
  default from: ENV['DEFAULT_FROM']

  def send_instructions_pdf(user_id, pdf)
      attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
      attachments['patient_visit_summary.pdf'] = {
        content: pdf,
        filename: 'patient_visit_summary.pdf',
        mime_type: 'application/pdf'
      } 

      user = User.find(user_id)      
      mail(to: user.email, subject: 'Starfield - Patient Visit Summary') do |format|
          format.html do
              render locals: { user: user }
          end
      end
  end
end
