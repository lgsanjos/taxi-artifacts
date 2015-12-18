#encoding: utf-8
require './app/api/entities/user.rb'
require './app/api/entities/user_credentials.rb'

module TaxiApp
  module Api
    class Auth < Grape::API
      resource :auth do

        desc "Authenticates user using email and password", entity: TaxiApp::Api::Entities::User, nickname: 'login'
        params do
          optional :body, type: TaxiApp::Api::Entities::UserCredentials
        end

        post('/login') do
          hash = Oj.load(request.body.read)
          user = User.new(hash)

          from_db = User.where('data @> ?', {username: user.username}.to_json).first
          error!({message: 'falha no login', description: 'usuário incorreto'}, 401) if from_db.nil?
          error!({message: 'falha no login', description: 'senha incorreta'}, 401) unless from_db.password == user.password

          present from_db, with: TaxiApp::Api::Entities::User
        end

        desc "Creates a new User", entity: TaxiApp::Api::Entities::User, nickname: 'signup'
        post('/signup') do
            hash = Oj.load(request.body.read)
            from_db = User.where('data @> ?', {username: hash['username']}.to_json).first
            error!({statusCode: 409, message: 'Este nome de usuário já existe', description: 'Usuário já existe'}, 409) if !from_db.nil?
            from_db = User.where('data @> ?', {email: hash['email']}.to_json).first
            error!({statusCode: 409, message: 'Este email já está cadastrado em nossa base', description: 'Email já existe'}, 409) if !from_db.nil?

            user = User.new(hash)
            user.generate_token
            user.save!

            present user, with: TaxiApp::Api::Entities::User
        end
      end
    end
  end
end
