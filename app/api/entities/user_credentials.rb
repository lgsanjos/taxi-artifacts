module TaxiApp
  module Api
    module Entities
      class UserCredentials < Grape::Entity
        expose :username, documentation: { type: 'string', required: true, description: 'User name' }
        expose :password, documentation: { type: 'string', required: true, description: 'User password' }
      end
    end
  end
end
