class NotesTemplateBlock < ApplicationRecord
  belongs_to :notes_template

  default_scope { order(order: :asc) }
end
