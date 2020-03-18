class EncounterNote < ApplicationRecord
    belongs_to :encounter_billing
    has_many :encounter_note_blocks, dependent: :destroy
    
    def json
      self.attributes.merge({"blocks" => self.blocks})  
    end 
    
    def blocks 
      encounter_note_blocks
    end 
    
end
