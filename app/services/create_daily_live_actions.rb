class CreateDailyLiveActions
  def initialize(attributes)
    @attributes = attributes
    @patient_id = @attributes[:patient_id]
  end

  def call
    Rails.logger.info("Create Daily Live Actions service triggered for patient #{@patient_id}")
    active_assigned_programs = AssignedProgram.where(status: :active)
    active_assigned_provider_actions = AssignedProviderAction.where(status: :active)
    if @patient_id.present?
      active_assigned_programs = active_assigned_programs.where(patient_id: @patient_id)
      active_assigned_provider_actions = active_assigned_provider_actions.where(patient_id: @patient_id)
    end
    active_assigned_programs.each do |assigned_program|
      CreateLiveActions.new({
      assigned_program: assigned_program
    }).call
    end

    active_assigned_provider_actions.each do |assigned_action|
      CreateLiveActions.new({
        assigned_provider_action: assigned_action
      }).call
    end
  end
end