# frozen_string_literal: true

require 'net/sftp'

namespace :fetch do
  task adt_files: :environment do
    file_names = []
    inbound_notif_ids = []
    Net::SFTP.start(ENV["ADT_SFTP_HOST"], ENV["ADT_SFTP_USERNAME"], :password => ENV["ADT_SFTP_PASSWORD"]) do |sftp|

        # get the list of files form remote
        sftp.dir.foreach("#{ENV["ADT_SFTP_INBOUND_DIR"]}") do |entry|
            file_names << entry.name
        end

        file_names.each do |file_name|
            data = sftp.download!("#{ENV["ADT_SFTP_INBOUND_DIR"]}/#{file_name}")

            adt_inbound_notification = AdtInboundNotification.create!(
              file_name: file_name,
              file_content: data
            )

            inbound_notif_ids << adt_inbound_notification.id
            data = sftp.remove("#{ENV["ADT_SFTP_INBOUND_DIR"]}/#{file_name}")
            # these are some test data
            # data = "MSH|^~\\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|20110921161840-0500||ADT^A03|680-201609254321_4f67d5ba-2502-4a43-b1df-841d60444|P|2.4|||AL|NE|USA\rEVN||20141030121201\rPID|1||94569-4565^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL\rPV1||I|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-234567^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20110816215822|20080827021200\rPV2|||Sprained ankle^Sprained ankle^L-ASHL\rDG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A\r"
            # data = "MSH|^~\&|STARFIELD|STAR^STAR|RHAPSODY|NDHIN|20220606210923||ADT^A31|iCbIO8NP0qBc9yjuBcALmA|T|2.5.1\rEVN|A31|20220606210923||I|\rPID|||1014||Koirala^Suman||19700101|M|||1854 NDSU Research Cir N^^Fargo^DC^58102||2187906564|"
          rescue StandardError => e
            Rollbar.warning("Error: #{e} --fetch:adt_files")
        end
    end

    inbound_notif_ids.each do |id|
      puts "Process ADT Notification #{id}"
      ProcessInboundAdtNotification.new({adt_inbound_notification_id: id}).call
    end
  end
end
