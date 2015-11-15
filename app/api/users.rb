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

        namespace ':username', requirements: { username: /[\w|\.]+/} do
          desc "Get user profile details", entity: TaxiApp::Api::Entities::User
          get('/') do
            authenticate!
            present current_user, with: TaxiApp::Api::Entities::User
          end

          desc "Update user profile", entity: TaxiApp::Api::Entities::User
          put('/') do
            authenticate!
            user = User.find_by(username: params[:username])
            authorize_user! user

            user.name = params[:name]
            user.save!

            present user, with: TaxiApp::Api::Entities::User
          end

          desc "Get all realties advertised by the user"
          get('/realties') do
            authenticate!
            user = User.find_by(username: params[:username])
            authorize_user! user

            present user.realties, with: TaxiApp::Api::Entities::Realty, is_logged_in: true
          end

          desc "Change user role", entity: TaxiApp::Api::Entities::User
          put('/upgrade') do
            authenticate!
            user = User.find_by(username: params[:username])
            authorize_user! user

            begin
              user.role = Oj.load(request.body.read)["role"]
              error!({
                message: 'operação não permitida',
                description: 'esta operação não pode ser realizada'
              }, 500) if user.role == 'admin'
              user.save!
            rescue Mongoid::Errors::Validations => e
              description = user.errors.full_messages.join(', ')
              error!({message: 'Erro ao atualizar plano', description: description}, 500)
            end

            present user, with: TaxiApp::Api::Entities::User
          end

          namespace :favorites do
            desc "Get user favorite realties"
            get('/') do
              authenticate!
              user = User.find_by(username: params[:username])
              authorize_user! user

              present user.favorites, with: TaxiApp::Api::Entities::Realty
            end

            desc "Add user favorite realty"
            post('/') do
              authenticate!
              authorize_user! User.new(username: params[:username])

              data = Oj.load(request.body.read)
              current_user.favorites << Realty.find(data["id"])
              current_user.save!

              present current_user, with: TaxiApp::Api::Entities::User
            end

            desc "Remove realty from user favorites"
            delete('/:id') do
              authenticate!
              user = User.find_by(username: params[:username])
              authorize_user! user

              realties = user.favorites.only(:address, :beds, :baths, :rate, :area, :_slugs, :modality, :image, :deleted_at)

              realty = Realty.find(params[:id])
              user.favorites.delete(realty)

              present user, with: TaxiApp::Api::Entities::User
            end
          end

          namespace :activate do
            desc "Activate user account", entity: TaxiApp::Api::Entities::User
            put('/') do
              begin
                user = User.find_by(activation_token: params[:token])
              rescue Mongoid::Errors::DocumentNotFound
                error!({statusCode: 403, message: 'Token inválido', description: 'esse link não é válido'}, 403) if user.nil?
              end
              user.verified = true
              user.save!

              present user, with: TaxiApp::Api::Entities::User
            end
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
