class ProcessNotesTemplateCreation
    def initialize(attributes)
        @attributes = attributes
        @name = @attributes[:name]
        @template_blocks = @attributes[:notes_template_blocks]
        @user_id = @attributes[:user_id]
    end

    def call
        notes_template = create_notes_template
        if notes_template
            Result.new(notes_template.id, "Template created.", true)
        else
            Result.new(nil, "Template cannot", true)
        end
    end

    private

    attr_accessor :name, :template_blocks, :user_id

    def create_notes_template
        notes_template = NotesTemplate.create!(
            name: name,
            archived: false,
            user_id: user_id,
        )

        create_template_blocks(notes_template)
        notes_template
    end

    def create_template_blocks(notes_template)
        template_blocks.each do |block|
            notes_template.notes_template_blocks.create(
                note: block[:note],
                order: block[:order]
            )
        end
    end
end