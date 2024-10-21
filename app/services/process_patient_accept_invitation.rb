class ProcessPatientAcceptInvitation
    def initialize(attributes)
        @attributes = attributes
        @user_id = @attributes[:user_id]
        @first_name = @attributes[:first_name]
        @middle_name = @attributes[:middle_name]
        @last_name = @attributes[:last_name]
        @email = @attributes[:email]
        @address = @attributes[:address]
        @city = @attributes[:city]
        @state = @attributes[:state]
        @zip = @attributes[:zip]
        @mobile_phone_number = @attributes[:mobile_phone_number]
        @gender = @attributes[:gender]
        @password = @attributes[:password]
    end

    def call
        process_user_accept_invitation
    end

    private

    attr_accessor :user_id, :first_name, :last_name, :email, :middle_name,:address, :city, :state, :zip, :mobile_phone_number, :gender, :password

    def user
        @user ||= User.find(user_id)
    end

    def process_user_accept_invitation
        begin
  
            user.first_name = first_name
            user.middle_name = middle_name
            user.last_name = last_name
            user.address = address
            user.city = city
            user.state = state
            user.zip = zip
            user.mobile_phone_number = mobile_phone_number
            user.gender = gender
            user.email = email
            user.user_creation_type = "invited"
            user.password = password

            user.invite_token = nil
            user.invitation_token = nil
            user.invitation_accepted_at = Time.now
            user.save!

            send_welcome_email
            Result.new(user, "#{user.name} you have completed your account setup, please sign in", true)
        rescue => e
            Rollbar.warning("Error on user completing setup #{e}")
            Rails.logger.error {"Error on user completing setup #{e}"}
            Rails.logger.error {e.backtrace.join("\n")}
            Result.new(nil, e.message, false)
        end 
    end

    def send_welcome_email
        InvitePatientMailer.welcome_patient(user).deliver
    end
end