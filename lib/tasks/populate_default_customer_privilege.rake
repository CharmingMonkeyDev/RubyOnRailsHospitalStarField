namespace :populate_default_customer_privilege do
    # to run this task rails populate_default_customer_privilege:add_default
    desc "Create or add default customer privilege"
    task add_default: :environment do
        # to add new privilege just add on the array and run other rake task too
        default_permissions = [
            "Allow questionnaires to display on local device",
            "Allow questionnaires to be assigned to patients by SMS text",
        ]
        default_permissions.each do |permission|
            CustomerPermission.find_or_create_by(name: permission)
        end
    end 

    # to run this task rails populate_default_customer_privilege:update_customer
    desc "Create of update customer privilge assignments"
    task update_customer: :environment do
        default_permissions = CustomerPermission.all
        customers = Customer.all
        default_permissions.each do |permission|
            customers.each do |customer|
                CustomerPermissionControl.find_or_create_by(customer_id: customer.id, customer_permission_id: permission.id)
            end
        end
    end
end
