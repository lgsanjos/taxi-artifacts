require 'sidekiq'

class ProcessRequestWorker
  include Sidekiq::Worker

  def perform(tryouts, id)
    Sidekiq::Logging.logger.level = Logger::INFO
    request = Request.find(id)
    return if request.has_attribute?(:taxi)

    if (request.tryouts == tryouts) && (request.driver.nil?)
      ProcessRequestWorker.perform_async request.id
    end
  end
end
