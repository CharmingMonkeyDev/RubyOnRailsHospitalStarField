# frozen_string_literal: true

module ApplicationHelper
  def flash_messages
    flash.map do |type, text|
      { id: text.object_id, type: type, text: text }
    end
  end

  def other_errors
    messages = []
    if defined?(resource) && resource.errors.any?
      resource.errors.full_messages.each do |message|
        messages.push({ id: 9999, type: 'error', text: message })
      end
    end
    messages
  end
end
