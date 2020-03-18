# frozen_string_literal: true

# rails db:seed:privileges 
if Privilege.count.zero?
  Privilege.create!(
      name: "Invite New Patient",
      description: "Invite New Patient",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "Edit Patient",
      description: "Edit Patient",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "Add Customer Association",
      description: "Add Customer Association",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "View Customers",
      description: "View Customers",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "View Patient Labs",
      description: "View Patient Labs",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "Update Privileges",
      description: "Update Privileges",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "Access Care Plan Builder",
      description: "Access Care Plan Builder",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
  Privilege.create!(
      name: "Access Resource Catalog",
      description: "Access Resource Catalog",
      default_pharmacist: true,
      default_physician: false,
      default_coach: false,
      default_patient: false
  )
end

# reporting privilege seeds
report_privilege_attributes = {
name: "Access Reporting",
description: "Access Reporting",
default_pharmacist: false,
default_physician: false,
default_coach: false,
default_patient: false
}
report_privilege = Privilege.find_or_create_by(name: report_privilege_attributes[:name])
report_privilege.update(report_privilege_attributes)

# build questionnaire privilege seeds
build_questionnaire_privilege_attributes = {
name: "Build Questionnaire",
description: "Build Questionnaire",
default_pharmacist: false,
default_physician: false,
default_coach: false,
default_patient: false
}
build_questionnaire_privilege = Privilege.find_or_create_by(name: build_questionnaire_privilege_attributes[:name])
build_questionnaire_privilege.update(build_questionnaire_privilege_attributes)

# Admin level reporting seeds
admin_report_privilege_attributes = {
name: "Admin Level Reporting",
description: "Admin Level Reporting",
default_pharmacist: false,
default_physician: false,
default_coach: false,
default_patient: false
}
admin_report_privilege = Privilege.find_or_create_by(name: admin_report_privilege_attributes[:name])
admin_report_privilege.update(admin_report_privilege_attributes)

# NDF reporting privilege seeds
ndm_report_privilege_attributes = {
name: "Access NDM Reporting",
description: "Access NDM Reporting",
default_pharmacist: false,
default_physician: false,
default_coach: false,
default_patient: false
}
ndm_report_privilege = Privilege.find_or_create_by(name: ndm_report_privilege_attributes[:name])
ndm_report_privilege.update(ndm_report_privilege_attributes)

# LTC Facilities Builder seeds
build_ltc_facility_privilege_attributes = {
name: "Access Living Facility Builder",
description: "Access Living Facility Builder",
default_pharmacist: false,
default_physician: false,
default_coach: false,
default_patient: false
}
ltc_facility_privilege = Privilege.find_or_create_by(name: build_ltc_facility_privilege_attributes[:name])
ltc_facility_privilege.update(build_ltc_facility_privilege_attributes)

# Creating a record for privileges for all the customer users
customer_users = CustomerUser.all
customer_users.each do |customer_user|
  cu_admin_report_privilege = CustomerUserPrivilege.find_or_create_by({customer_user: customer_user, privilege: admin_report_privilege})
  cu_report_privilege = CustomerUserPrivilege.find_or_create_by({customer_user: customer_user, privilege: report_privilege})
  cu_quiestionnaire_privilege = CustomerUserPrivilege.find_or_create_by({customer_user: customer_user, privilege: build_questionnaire_privilege})
  cu_ndm_privilege = CustomerUserPrivilege.find_or_create_by({customer_user: customer_user, privilege: ndm_report_privilege})
  cu_ltc_facility_privilege = CustomerUserPrivilege.find_or_create_by({customer_user: customer_user, privilege: ltc_facility_privilege})
end

