class DummyEmail
    # this email is use when a user does not have email we use this template
    # called on bulk patient upload and manual patient creation
    def initialize
    end
    
    def get_email
        random_letter = ('a'..'z').to_a.sample
        uniq_time = Time.now.to_i
        dummy_email = "#{uniq_time}#{random_letter}@no-email-user.com"
        return dummy_email
    end
end

