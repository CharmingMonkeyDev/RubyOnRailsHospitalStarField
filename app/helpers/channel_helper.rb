# frozen_string_literal: true

module ChannelHelper
  # TODO unused now, cna we remove?
  def setup_patient_channels(customer_group, patient)
    customer_group.users.where(role: 'pharmacist').each do |pharmacist|
      channel = pharmacist.chat_channels.create!(name: "#{patient.name}, #{pharmacist.name}")
      channel.chat_channel_users.create!(user_id: patient.id, chat_user: "#{patient.id}-patient", user_type: 'patient')
      channel.chat_channel_users.create!(user_id: pharmacist.id, chat_user: "#{pharmacist.id}-pharmacist",
                                         user_type: 'pharmacist')
    end
  end

  def check_duplicate_channels(new_channel_user_ids)
    duplicate_channel = 0
    current_user.chat_channels.each do |channel|
      channel_user_ids = channel.chat_channel_users.pluck('user_id')
      duplicate_channel = channel.id if channel_user_ids.sort.join(',') == new_channel_user_ids.sort.join(',')
    end
    ChatChannel.find_by_id(duplicate_channel)
  end

  def get_channel_user_ids(chat_channel_strong_params)
    new_channel_user_ids = [current_user.id]
    if !chat_channel_strong_params[:patient].nil? && chat_channel_strong_params[:patient].length.positive?
      new_channel_user_ids.push(chat_channel_strong_params[:patient].to_i)
    end
    if chat_channel_strong_params[:colleagues].length.positive?
      chat_channel_strong_params[:colleagues].split(',').each do |colleague|
        new_channel_user_ids.push(colleague.to_i)
      end
    end
    new_channel_user_ids
  end
end
