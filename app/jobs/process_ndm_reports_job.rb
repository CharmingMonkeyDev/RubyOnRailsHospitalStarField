class ProcessNdmReportsJob < ApplicationJob
  queue_as :default

  def perform(attributes)
    ProcessNdmReports.new(attributes).call
  end
end