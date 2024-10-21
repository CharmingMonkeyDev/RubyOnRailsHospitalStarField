namespace :service_test do
  task adt_discharge_action_queue: :environment do

    # this is a test to see if inbound adt is creating action queue or not, this only works for patient iwth mrn 1002
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|20110921161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||1002^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||I|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20110816215822|20080827021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call
    
  end

  task adt_discharge_seed_data: :environment do
    # this is a test to see if inbound adt is creating action queue or not, this only works for patient iwth mrn 1002
    patients = User.where(role: "patient")

    patient = patients.first
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||I|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221201021200|20221201021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call
    
    patient = patients.first
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||I|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221201021200|20230101021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call

    patient = patients.second
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||O|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221202021200|20221201021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call

    patient = patients.third
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||O|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221203021200|20221201021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call

    patient = patients.third
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||O|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221203021200|20221215021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call

    patient = patients.fourth
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||U|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221203021200|20221201021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call
    assinged_pathway_action = patient.assigned_pathway_week_actions.where(text: "Patient Discharged").last
    provider = User.where(email: "dev+star_pharmacist@codelation.com").first
    assinged_pathway_action.update!(
      assigned_coach_id: provider.id,
      status: "incomplete"
    )

    patient = patients.third
    data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|2022121161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||U|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20221203021200|20221215021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
    file_name = "test_filename"
    adt_inbound_notification = AdtInboundNotification.create!(
        file_name: file_name,
        file_content: data
    )
    ProcessInboundAdtNotification.new({adt_inbound_notification_id: adt_inbound_notification.id}).call
    assinged_pathway_action = patient.assigned_pathway_week_actions.where(text: "Patient Discharged").last
    provider = User.where(email: "dev+star_pharmacist@codelation.com").first
    assinged_pathway_action.update!(
      assigned_coach_id: provider.id,
      status: "incomplete"
    )
  end

end
