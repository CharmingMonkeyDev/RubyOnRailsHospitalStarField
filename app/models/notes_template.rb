class NotesTemplate < ApplicationRecord
  has_many :notes_template_blocks
  belongs_to :user
  
  def as_json(options = {})
       options[:include] =
           %i[
               blocks
           ]
       super
  end
  
  def blocks 
    notes_template_blocks
  end  
end
