class PatientInstruction < ApplicationRecord
    belongs_to :encounter_billing
    has_many :instruction_blocks, dependent: :destroy
    
    def full_json
      self.attributes.merge({"blocks" => self.blocks})  
    end
    
    def to_text 
      self.blocks.present? ? self.blocks.map{|b| b.note}.join("<br>") : "" 
    end

    def blocks
      self.instruction_blocks
    end
end
