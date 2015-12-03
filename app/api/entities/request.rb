module TaxiApp
  module Api
    module Entities
      class Request < Grape::Entity
        expose :id, documentation: { type: 'integer', description: 'Id from database' }
        expose :number, documentation: { type: 'integer', description: 'Email' }
        expose :taxi, documentation: { type: 'string', description: 'Image' }
        expose :customer, documentation: { type: 'string', description: 'Username' }
        expose :large_trunk, documentation: { type: 'boolean', description: 'large trunk' }
        expose :address, documentation: { type: 'string', description: 'Username' }
        expose :created_at, documentation: { type: 'dateTime', description: 'First name' }
        expose :accepted_at, documentation: { type: 'dateTime', description: 'First name' }
        expose :creator, documentation: { type: 'string', description: 'Person who created' }
        expose :observation, documentation: { type: 'string', description: 'observation' }
        expose :payment, documentation: { type: 'string', description: 'payment type' }
        expose :tryouts, documentation: { type: 'integer', description: 'Attempts to find a cab' }
      end
    end
  end
end
