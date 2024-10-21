class CreateLiveActionsJob < ApplicationJob
  queue_as :default

  def perform(attributes)
    CreateLiveActions.new(attributes).call
  end
end
