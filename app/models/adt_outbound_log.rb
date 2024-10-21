class AdtOutboundLog < ApplicationRecord
    belongs_to :user
    belongs_to :requested_by, class_name: "User", optional: true
    before_create :generate_uniq_message_control_id, if: Proc.new { self.message_control_id.nil? }

    protected

    def generate_uniq_message_control_id
        self.message_control_id = loop do
            random_token = SecureRandom.urlsafe_base64(nil, false)
            break random_token unless AdtOutboundLog.exists?(message_control_id: random_token)
        end
    end
end
