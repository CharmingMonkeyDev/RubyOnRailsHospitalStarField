class CustomerPermission < ApplicationRecord
    has_many :customer_permission_controls

    # default privilege can be added and update via populate_default_customer_privilege.rake
    # after adding new privilege, run 2 taks from that rake file
    #  existing default_permissions = [
    #         "Allow questionnaires to display on local device",
    #         "Allow questionnaires to be assigned to patients by SMS text",
    #     ]
end
