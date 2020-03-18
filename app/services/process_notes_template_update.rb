class ProcessNotesTemplateUpdate
    def initialize(attributes)
        @attributes = attributes
        @name = @attributes[:name]
        @template_blocks = @attributes[:notes_template_blocks]
        @template_id = @attributes[:template_id]
        @removed_block_ids = @attributes[:removed_block_ids]
    end

    def call
        update_template
        Result.new(nil, "Template Updated.", true)
    end

    private

    attr_accessor :name, :template_blocks, :template_id, :removed_block_ids

    def notes_template
        @notes_template ||= NotesTemplate.find(template_id)
    end

    def update_template
        update_note_template
        update_existing_template_blocks
        remove_deleted_blocks
    end

    def update_note_template
        notes_template.update(
            name: name
        )
    end

    def update_existing_template_blocks
        template_blocks.each do |block|
            if block[:id].present?
                note_block = NotesTemplateBlock.find(block[:id])
                note_block.update(
                    note: block[:note],
                    order: block[:order]
                )
            else
                create_new_note_block(block)
            end
        end
    end

    def create_new_note_block(block)
        notes_template.notes_template_blocks.create(
            note: block[:note],
            order: block[:order]
        )
    end

    def remove_deleted_blocks
        if removed_block_ids.length > 0
            removed_block_ids.each do |block_id|
                NotesTemplateBlock.find(block_id).destroy
            end
        end
    end
end