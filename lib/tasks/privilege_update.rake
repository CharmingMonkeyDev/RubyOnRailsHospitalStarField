# frozen_string_literal: true

namespace :privilege do
  task update: :environment do
    all_customer_ids = Customer.ids
    customer_with_incomplete_privileges = CustomerDefaultPrivilege.where(customer_id: all_customer_ids).group('customer_default_privileges.id, customer_default_privileges.customer_id').
    having('count(customer_default_privileges.customer_id) < 8')
    incomplete_customer_ids = customer_with_incomplete_privileges.pluck(:customer_id).uniq
    all_privilege_ids = Privilege.ids

    incomplete_customer_ids.each do |customer_id|
        all_privilege_ids.each do |privilege_id|
            customer_default_privilege = CustomerDefaultPrivilege.where(customer_id: customer_id, privilege_id: privilege_id)
            unless customer_default_privilege.present?
                CustomerDefaultPrivilege.create(
                    customer_id: customer_id,
                    privilege_id: privilege_id,
                    default_pharmacist: true,
                    default_physician: true,
                    default_coach: true,
                    default_patient: true
                )
                puts "creating defualt privilege for customer #{customer_id} for privilege #{privilege_id}"
            end
        end
    end
  end

  # to call: rails privilege:sync_default_customer_privilege
  task sync_default_customer_privilege: :environment do
    customers = Customer.all
    privileges = Privilege.all
      privileges.each do |priv|
        customers.each do |customer|
          cus_def_priv = CustomerDefaultPrivilege.where(customer_id: customer.id, privilege_id: priv.id).first
          if !cus_def_priv.present?
            CustomerDefaultPrivilege.create(customer_id: customer.id, privilege_id: priv.id, default_pharmacist: false, default_physician:false, default_coach: false)
            puts "Privelige for customer: #{customer.id} for Priv: #{priv.id}"
          end
        end
      end
  end

  task update_names: :environment do
    update_customer_association_privilege = Privilege.where(name: "Add Customer Association").first
    if update_customer_association_privilege.present?
      update_customer_association_privilege.update(name: "Edit Customer Association", description: "Edit Customer Association")
    end
  end
end
