#encoding: utf-8
require './app/api/entities/user.rb'

module TaxiApp
  module Api
    class Users < Grape::API
      def self.options(access_token_required=true, admin_only=false)
        notes = admin_only ? 'This operation is restricted for users with `admin` role' : nil
        {
          headers: {
            "X-Access-Token" => {
              description: "Valdates your identity",
              required: access_token_required
            }
          },
          notes: notes
        }
      end

      desc '', options
      resource :users do
        desc "Search for users", options(true, true).merge({entity: TaxiApp::Api::Entities::User, is_array: true})
        get('/') do
          users = User.all
          present users, with: TaxiApp::Api::Entities::User
        end

        desc "Update user profile", entity: TaxiApp::Api::Entities::User
        put('/update') do
            hash = Oj.load(request.body.read)

            user = User.find(hash['id'])
            user.name = hash['name']
            user.username = hash['username']
            user.phone = hash['phone']
            user.email = hash['email']
            user.taxi_id = hash['taxi_id']

            unless hash['password'].blank?
                user.password = hash['password']
            end
            user.save!

            present user, with: TaxiApp::Api::Entities::User
        end

        namespace ':username', requirements: { username: /[\w|\.]+/} do
          desc "Get user profile details", entity: TaxiApp::Api::Entities::User
          get('/') do
            authenticate!
            present current_user, with: TaxiApp::Api::Entities::User
          end

          namespace :password do
            desc "Change user password", entity: TaxiApp::Api::Entities::User
            put('/') do
              authenticate!
              user = User.find_by(username: params[:username])
              authorize_user! user
              error!({statusCode: 500, message: 'Senha atual incorreta', description: 'senha atual inválida'}, 500) if user.password != params[:current_password]
              user.password = params[:new_password]
              user.save!

              present user, with: TaxiApp::Api::Entities::User
            end

            namespace :reset do
              desc "Generates a user password reset token"
              post '/' do
                begin
                  user = User.find_by(email: params[:email])
                  user.reset_password_token = SecureRandom.uuid
                  user.save!
                  mailer.send_reset_password(user)
                  {status: 'success'}
                rescue Mongoid::Errors::DocumentNotFound => e
                  message = "Email informado inválido"
                  error!(message, 500)
                end
              end

              desc "Resets user password", entity: TaxiApp::Api::Entities::User
              put('/') do
                begin
                  user = User.find_by(reset_password_token: params[:token])
                rescue Mongoid::Errors::DocumentNotFound
                  error!({statusCode: 403, message: 'Token inválido', description: 'esse link não é válido'}, 403) if user.nil?
                end
                user.password = params[:password]
                user.save!

                present user, with: TaxiApp::Api::Entities::User
              end
            end
          end

        end
      end

    end
  end
end
