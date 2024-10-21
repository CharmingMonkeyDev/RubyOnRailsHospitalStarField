class ProcessProviderInvitation    
    def initialize(attributes)
        @attributes = attributes
        @first_name = @attributes[:first_name]
        @middle_name = @attributes[:middle_name]
        @last_name = @attributes[:last_name]
        @email = @attributes[:email]
        @invited_by_id = @attributes[:invited_by_id]
        @role = @attributes[:role]
        @mobile_phone_number = @attributes[:mobile_phone_number]
        @business_phone_number = @attributes[:business_phone_number]
        @provider_npi_number = @attributes[:provider_npi_number]
    end

    def call
        process_user_invitation
    end

    private

    attr_accessor :first_name, :last_name, :email, :middle_name, :invited_by_id, :role, :mobile_phone_number, :business_phone_number, :provider_npi_number

    def invited_by
        @invited_by ||= User.find(invited_by_id)
    end

    def process_user_invitation
        
        begin
            user = User.find_by_email(email)
            if user.present?
                return Result.new(user, "Error:  The submitted email address is already in use.  Unable to send invitation.", false)
            end

            ActiveRecord::Base.transaction do
                user = User.invite!(
                    email: email,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    role: role,
                    mobile_phone_number: mobile_phone_number,
                    business_phone_number: business_phone_number,
                    provider_npi_number: provider_npi_number
                )

                user.invited_by_id = invited_by_id
                user.save!
                customer_user = assign_user_to_customer(user)
                AssignCustomerUserPrivileges.new({customer_user: customer_user}).call
            end
            
            Result.new(user, "#{user.name} has been invited to Starfield", true)
        rescue => e
            Rollbar.warning("Error on provider invitation #{e}")
            Result.new(nil, e.message, false)
        end 
    end

    def assign_user_to_customer(user)
        selected_customer = invited_by.customer_selection.customer
        customer_user = CustomerUser.create!(
            user: user,
            customer: selected_customer,
            status: "accepted",
            assigned_at: Time.now,
            created_by_id: invited_by_id
        )
        return customer_user
    end
end