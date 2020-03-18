# frozen_string_literal: true

class ProcessPatientCreation
    def initialize(attributes)
        @attributes = attributes
        @first_name = @attributes[:first_name]
        @middle_name = @attributes[:middle_name]
        @last_name = @attributes[:last_name]
        @email = @attributes[:email]
        @date_of_birth = @attributes[:date_of_birth]
        @invited_by_id = @attributes[:invited_by_id]
        @user_creation_type = @attributes[:user_creation_type]

        # params for manual users
        @mobile_phone_number = @attributes[:mobile_phone_number]
        @gender = @attributes[:gender]
        @address = @attributes[:address]
        @city = @attributes[:city]
        @state = @attributes[:state]
        @zip = @attributes[:zip]
        @password = @attributes[:password]
    end

    def call
        process_user_invitation
    end

    private

    attr_accessor :first_name, :last_name, :email, :date_of_birth, :middle_name, :invited_by_id, :user_creation_type, :mobile_phone_number,:address, :city, :state, :zip, :gender, :password

    def invited_by
        @invited_by ||= User.find(invited_by_id)
    end

    def process_user_invitation
        
        begin
            user = User.find_by_email(email)
            message = ""
            if user.present?
                return Result.new(user, "Error: The submitted email address is already in use.  Unable create account.", false)
            end
            ActiveRecord::Base.transaction do
                user = User.invite!(
                    email: email,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    date_of_birth: date_of_birth,
                    role: "patient"
                ) do |u|
                    u.skip_invitation = true
                end
                customer_user = assign_user_to_customer(user)

                begin
                    if user_creation_type == "invited"
                        user.invite_token = Digest::SHA1.hexdigest(email)
                        user.invited_by_id = invited_by_id
                        user.save!
                        InvitePatientMailer.invite_patient(user).deliver
                        user.user_creation_type = "invited"
                        user.save!
                        message = "#{user.name} has been invited to Starfield"
                    elsif user_creation_type == "not_invited"
                        user.invited_by_id = invited_by_id
                        user.mobile_phone_number = mobile_phone_number
                        user.gender = gender
                        user.address = address
                        user.city = city
                        user.state = state
                        user.zip = zip
                        user.user_creation_type = "not_invited"
                        user.password = password if password
                        user.save!
                        message = "#{user.name} has been added to Starfield"
                    end
                rescue ActiveRecord::RecordInvalid => e
                    return Result.new(nil, e.record.errors.full_messages.join(", "), false)
                end
            end
            if user 
                # ProcessNdiisLink.new({user_id: user.id}).call
                # making it a backend process
                ProcessSqsMessageCreation.new({service_name: "ProcessNdiisLink", user_id: user.id}).call
                Result.new(user, message, true)
            else
                Result.new(nil, "Cannot create a user, contact admin", false)
            end
            
        rescue => e
            Rollbar.warning("Error on patient invitation #{e}")
            msg = e.message || "Cannot create a user, please verify the fields"
            Result.new(nil, msg, false)
        end 
    end

    def assign_user_to_customer(user)
        status = user_creation_type == "not_invited"? "accepted" : "pending"
        selected_customer = invited_by.customer_selection.customer
        customer_user = CustomerUser.create!(
            user: user,
            customer: selected_customer,
            status: status,
            assigned_at: Time.now,
            created_by_id: invited_by_id
        )
        return customer_user
    end
end