module TaxiApp
  module Api
    module Entities
      class Taxi < Grape::Entity
        expose :id, documentation: { type: 'string', description: 'id' }
        expose :code, documentation: { type: 'string', description: 'cab number' }

        expose :license_plate, documentation: { type: 'string', description: 'plate' }
        expose :payment_methods, documentation: { type: 'string', is_array:true, description: 'First name' }
        expose :busy, documentation: { type: 'string', is_array:true, description: 'First name' }
        expose :large_trunk, documentation: { type: 'string', is_array:true, description: 'First name' }

        expose :last_location, documentation: { type: 'string', description: 'Last position ' }
        expose :gcm_token, documentation: { type: 'string', description: 'GCM token' }
        expose :access_token, documentation: { type: 'string', description: 'token to use our API' }
      end
    end
  end
end
