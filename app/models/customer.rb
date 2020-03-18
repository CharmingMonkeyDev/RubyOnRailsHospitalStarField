class Customer < ApplicationRecord
    has_many :customer_users, dependent: :destroy
    has_many :users, through: :customer_users
    has_many :customer_selections, dependent: :destroy
    has_many :patient_actions
    has_many :patient_action_groups
    has_many :action_pathways
    has_many :assigned_pathways, through: :action_pathways
    has_many :assigned_pathway_weeks, through: :assigned_pathways
    has_many :assigned_pathway_week_actions, through: :assigned_pathway_weeks
    has_many :resource_items, dependent: :destroy
    has_many :customer_default_privileges, dependent: :destroy
    has_many :encounter_billings
    has_many :questionnaires
    has_many :customer_permission_controls
    has_many :customer_permissions, through: :customer_permission_controls
    has_many :actions    
    has_many :questionnaire_categories, -> { where(is_archived: false) }
    has_many :action_categories, -> { where(is_archived: false) }
    has_many :programs    
    has_many :program_actions, through: :programs
    has_one :company_action_setting
    has_many :ltc_facilities

    # callbacks
    after_create :assign_default_privileges
    after_create :create_customer_permission

    def full_address
        "#{self.address}, #{self.city}, #{self.state} #{self.zip}"
    end

    def serializable_hash(options = nil)
        super(options).merge(
            full_address: full_address,
            deleteable: check_deleteable
        )
    end

    def check_deleteable
        customer = self
        users = customer.users
        patient_users = users.where(role: "patient")
        users.count == 1 && patient_users.count == 0 
    end

    private

    def assign_default_privileges
        Privilege.all.each do |privilege|
            default_pharmacist = nil
            default_physician = nil
            default_coach = nil
            default_patient = nil
            if privilege.name == "Invite New Patient"
                create_customer_default_privilege(privilege.id, true, true, true, false)
            end
            if privilege.name == "Edit Patient"
                create_customer_default_privilege(privilege.id, true, true, true, true)
            end
            if privilege.name == "Add Customer Association"
                create_customer_default_privilege(privilege.id, true, true, true, false)
            end
            if privilege.name == "View Customers"
                create_customer_default_privilege(privilege.id, true, true, true, false)
            end
            if privilege.name == "View Patient Labs"
                create_customer_default_privilege(privilege.id, true, true, true, true)
            end
            if privilege.name == "Update Privileges"
                create_customer_default_privilege(privilege.id, true, true, true, false)
            end
            if privilege.name == "Access Care Plan Builder"
                create_customer_default_privilege(privilege.id, true, true, true, false)
            end
            if privilege.name == "Access Resource Catalog"
                create_customer_default_privilege(privilege.id, true, true, true, true)
            end
        end
    end

    def create_customer_default_privilege(privilege_id, default_pharmacist = false, default_physician = false, default_coach = false, default_patient = false)
        CustomerDefaultPrivilege.create(
            customer_id: self.id,
            privilege_id: privilege_id,
            default_pharmacist: default_pharmacist,
            default_physician: default_physician,
            default_coach: default_coach,
            default_patient: default_patient
        )
    end

    def create_customer_permission
        permissions = CustomerPermission.all
        permissions.each do |permission|
            CustomerPermissionControl.create(
                customer_id: self.id,
                customer_permission_id: permission.id,
                permitted: false
            )
        end
    end
end
