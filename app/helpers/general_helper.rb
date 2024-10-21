# frozen_string_literal: true

module GeneralHelper
  def to_snake_case(text)
    text.gsub(/([a-z])([A-Z])/, '\1_\2').gsub(/[\s-]+/, '_').downcase
  end
end
