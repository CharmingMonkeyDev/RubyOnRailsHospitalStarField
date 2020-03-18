# frozen_string_literal: true

require 'net/http'
require 'json'
require 'stream-chat'
require 'stream-chat/version'
require 'date'

namespace :chat do
  task missed_chat: :environment do
    users = User.all

    if users.length.positive?
      client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])

      unread_messages = false
      users.each do |user|
        channel_member = user.chat_channel_users.first.chat_user if user.chat_channel_users.first

        next unless channel_member

        filter = { 'members' => { '$in' => [channel_member] } }
        channels = client.query_channels(filter)

        unread_messages = false
        channels.each do |channel|
          next if channel[1].class.to_s == 'String' # deal with getstreams screwy data stream... sigh

          channel[1].each do |item|
            next if item.class.to_s == 'String'

            hash = HashWithIndifferentAccess.new(item)
            read_items = hash[:read]
            read_items.each do |read_item|
              unread_messages = true if read_item[:unread_messages].to_i.positive?
            end
          end
        end

        if unread_messages
          ChatMailer.missed_messages(user).deliver
          puts "Missed messages email sent to: #{user.name}"
        end
      end
    end
  rescue StandardError => e
    puts '*****************'
    puts "failed #{e}"
    puts '*****************'
    Rollbar.warning("Error syncing glucose devices with #{e}")
  end

  task last_chat: :environment do
    users = User.where(role: 'patient')

    if users.length.positive?
      client = StreamChat::Client.new(api_key = ENV['GETSTREAM_API_KEY'], api_secret = ENV['GETSTREAM_API_SECRET'])

      users.each do |user|
        channel_member = user.chat_channel_users.first.chat_user if user.chat_channel_users.first
        last_read_array = []

        if channel_member
          filter = { 'members' => { '$in' => [channel_member] } }
          channels = client.query_channels(filter)

          # Search through each channel the user is a member of
          channels.each do |channel|
            next if channel[1].class.to_s == 'String'

            channel[1].each do |item|
              next if item.class.to_s == 'String'

              hash = HashWithIndifferentAccess.new(item)
              read_items = hash[:read]
              # Get last time user was active(last message sent/read) in the system
              read_items.each do |read_item|
                if read_item[:user][:last_active]
                  zone = ActiveSupport::TimeZone.new(ENV['APP_TIMEZONE'])
                  last_read_array.push(Date.parse(read_item[:user][:last_active]).in_time_zone(zone))
                end
              end
            end
          end
        end

        # Get most recent date(last message sent/read)
        last_chat_date = last_read_array.max
        next if last_chat_date.nil?

        user.update!(last_contact_at: last_chat_date)
      end
    end
  rescue StandardError => e
    puts '*****************'
    puts "failed #{e}"
    puts '*****************'
    Rollbar.warning("Error syncing glucose devices with #{e}")
  end
end
