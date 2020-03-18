class CustomerAssociationMailer < ApplicationMailer
    default from: ENV['DEFAULT_FROM']

    def new_customer_association_provider(user, customer)
        attachments.inline['email-logo.png'] = File.read("#{Rails.root}/app/assets/images/email-logo.png")
        attachments.inline['email-head7.png'] = File.read("#{Rails.root}/app/assets/images/email-head7.png")
        mail(to: user.email, subject: 'Starfield - New Customer Association') do |format|
            format.html do
                render locals: { user: user, customer: customer }
            end
        end
    end
end
