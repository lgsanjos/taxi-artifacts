module TaxiApp
  module Api
    module Entities
      class Taxi < Grape::Entity
        expose :id, documentation: { type: 'string', description: 'id' }
        expose :code, documentation: { type: 'string', description: 'cab number' }
        expose :license_plate, documentation: { type: 'string', description: 'plate' }
        expose :payment_methods, documentation: { type: 'string', is_array:true, description: 'payment methods' }
        expose :busy, documentation: { type: 'boolean', description: 'Busy status' }
        expose :large_trunk, documentation: { type: 'boolean', description: 'if taxi has large trunk' }
        expose :last_location, documentation: { type: 'string', description: 'Last position ' }
        expose :user, using: TaxiApp::Api::Entities::User, documentation: { type: 'TaxiApp::Api::Entities::User', description: 'Taxi driver' }
      end
    end
  end
end
