module TaxiApp
  module Api
    module Entities
      class TaxiStatus < Grape::Entity
        expose :free, documentation: { type: 'string', description: 'Total de taxis not busy' }
        expose :busy, documentation: { type: 'string', description: 'Total de taxis busy' }
      end
    end
  end
end
