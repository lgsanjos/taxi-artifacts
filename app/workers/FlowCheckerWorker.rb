require 'sidekiq'

class FlowCheckerWorker
  include Sidekiq::Worker

  def perform(id, tryouts)
    Sidekiq::Logging.logger.level = Logger::INFO
    logger.info "FlowCheckerWorker"

    request = Request.find(id)
    return if request.has_attribute?(:driver)

    if (request.tryouts == tryouts) && (request.driver.nil?)
      ProcessRequestWorker.perform_async request.id
    end
  end
end
