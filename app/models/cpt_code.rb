class CptCode < ApplicationRecord
    def serializable_hash(options = nil)
        super(options).merge(
        sanitized_name: sanitized_name
        )
    end

    private

    def sanitized_name
        "#{name}(#{code})"
    end
end
