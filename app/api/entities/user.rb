module TaxiApp
  module Api
    module Entities
      class User < Grape::Entity
        expose :id, documentation: { type: 'string', description: 'id' }
        expose :email, documentation: { type: 'string', description: 'Email' }
        expose :username, documentation: { type: 'string', description: 'Username' }
        expose :name, documentation: { type: 'string', description: 'Full name' }
        expose :first_name, documentation: { type: 'string', description: 'First name' }
        expose :created_at, documentation: { type: 'dateTime', description: 'Account Creation Date' }
        expose :taxi_id, documentation: { type: 'string', description: 'Taxi id' }

        expose :access_token, documentation: { type: 'string', required: true, description: 'Access Token' }
      end
    end
  end
end
