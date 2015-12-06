module TaxiApp
  module Api
    module Entities
      class User < Grape::Entity
        expose :id, documentation: { type: 'string', description: 'id' }
        expose :email, documentation: { type: 'string', description: 'Email' }
        expose :username, documentation: { type: 'string', description: 'Username' }
        expose :name, documentation: { type: 'string', description: 'Full name' }
        expose :phone, documentation: { type: 'string', description: 'Full name' }
        expose :first_name, documentation: { type: 'string', description: 'First name' }
        expose :created_at, documentation: { type: 'dateTime', description: 'Account Creation Date' }
        expose :access_token, documentation: { type: 'string', required: true, description: 'Access Token' }
        expose :gcm_token, documentation: { type: 'string', required: true, description: 'GCM Token' }
      end
    end
  end
end
