#encoding: utf-8
require 'grape'
require 'grape-entity'
require 'grape-swagger'
require 'oj'
Dir["./config/initializers/**.rb", "./app/**.rb", "./app/api/**.rb", "./app/model/**.rb", "./app/services/**.rb"].each {|file| require file}

module TaxiApp
  class API < Grape::API
    version 'v1', using: :path
    content_type :json, "application/json;charset=UTF-8"
    format :json

    rescue_from TaxiApp::Api::Errors::NoResults do |e|
      error_response({status: 404, message: e.message})
    end

    helpers do
      def current_user
        token = headers['X-Access-Token'] || env['X-Access-Token']
        @current_user ||= User.authorize!(token)
      end

      def authenticate!
        error!('401 Unauthorized', 401) unless current_user
      end

      def authorize_user!(user)
        error!({statusCode: 403, message: 'Imóvel não pode ser removido', description: 'não pertence ao usuário'}, 403) if user.nil?
        error!({statusCode: 403, message: 'Usuário não tem permissão', description: user.username}, 403) unless current_user.username == user.username
      end

      def authorize_role!(role)
        error!({statusCode: 403, message: 'Usuário não tem permissão', description: role}, 403) unless current_user.has_role?(role)
      end
    end

    mount TaxiApp::Api::Users
    mount TaxiApp::Api::Requests
    mount TaxiApp::Api::Auth
    mount TaxiApp::Api::Taxis

    add_swagger_documentation(
      api_version: 'v1',
      base_path: '/api',
      mount_path: 'docs',
      hide_documentation_path: true,
      hide_format: true,
    )
  end
end
