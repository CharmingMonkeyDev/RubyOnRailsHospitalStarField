if NotesTemplate.count == 0 
  template = NotesTemplate.create(
    name: "Template 1",
    user_id: User.find_by_email("dev+star_pharmacist@codelation.com").id,
  )
  NotesTemplateBlock.create(note: "Test note 1", order: 1, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 2", order: 2, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 3", order: 3, notes_template_id: template.id)
  
  template = NotesTemplate.create(
    name: "Template 2",
    user_id: User.find_by_email("dev+star_pharmacist@codelation.com").id,
  )
  NotesTemplateBlock.create(note: "Test note 1", order: 1, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 2", order: 2, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 3", order: 3, notes_template_id: template.id)
  
  template = NotesTemplate.create(
    name: "Template 3",
    user_id: User.find_by_email("dev+star_pharmacist@codelation.com").id,
  )
  NotesTemplateBlock.create(note: "Test note 1", order: 1, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 2", order: 2, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 3", order: 3, notes_template_id: template.id)
  
  template = NotesTemplate.create(
    name: "Template 4",
    user_id: User.find_by_email("dev+star_pharmacist@codelation.com").id,
  )
  NotesTemplateBlock.create(note: "Test note 1", order: 1, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 2", order: 2, notes_template_id: template.id)
  NotesTemplateBlock.create(note: "Test note 3", order: 3, notes_template_id: template.id)
end 