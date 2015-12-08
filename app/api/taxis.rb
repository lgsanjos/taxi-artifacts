#encoding: utf-8
require './app/api/entities/taxi.rb'
require './app/model/taxi.rb'

module TaxiApp
  module Api
    class Taxis < Grape::API
      resource :taxis do
        desc "Retrieve a list of taxis and their location", entity: TaxiApp::Api::Entities::Taxi
        get('/') do
          taxis = Taxi.all
          present taxis, with: TaxiApp::Api::Entities::Taxi
        end

        desc "Creates a new Taxi", entity: TaxiApp::Api::Entities::Taxi
        post('/') do
          hash = Oj.load(request.body.read)
          taxi = Taxi.new(hash)
          taxi.busy = true
          taxi.save!

          present taxi, with: TaxiApp::Api::Entities::Taxi
        end

        desc "Updates a taxi info", entity: TaxiApp::Api::Entities::Taxi
        put('/') do
          hash = Oj.load(request.body.read)
          taxi = Taxi.find(params[:id])
          taxi.license_plate = params[:license_plate]
          taxi.code = params[:code]
          taxi.payment_methods = params[:payment_methods]
          taxi.large_trunk = params[:large_trunk]
          present taxi, with: TaxiApp::Api::Entities::Taxi
        end

        desc "Stores the generated token from android app for GCM communication", entity: TaxiApp::Api::Entities::Taxi
        put ":id/gcm_token" do
          taxi = Taxi.find(params[:id])
          taxi.gcm_token = params[:gcm_token]
          taxi.save!
          present taxi, with: TaxiApp::Api::Entities::Taxi
        end

        resource ":id/location" do
          desc "Updataes the current location", entity: TaxiApp::Api::Entities::Taxi
          put do
            hash = Oj.load(request.body.read)

            taxi = Taxi.find(params[:id])
            taxi.last_location = [hash['latitude'], hash['longitude']]
            taxi.heartbeat = Time.now
            taxi.save!

            present taxi, with: TaxiApp::Api::Entities::Taxi
          end
        end

        resource ":id/busy" do
          desc "Updataes the busy status", entity: TaxiApp::Api::Entities::Taxi
          put do
            taxi = Taxi.find(params[:id])
            taxi.busy = params[:busy]
            taxi.save!

            present taxi, with: TaxiApp::Api::Entities::Taxi
          end
        end

        desc "Login the cab driver from android app", entity: TaxiApp::Api::Entities::Taxi
        post('/login') do
          hash = Oj.load(request.body.read)
          user = User.new(hash)

          from_db = User.where('data @> ?', {username: user.username}.to_json).first
          error!({message: 'falha no login', description: 'usuário incorreto'}, 401) if from_db.nil?
          error!({message: 'falha no login', description: 'senha incorreta'}, 401) unless from_db.password == user.password

          error!({message: 'falha no login', description: 'Usuário não está associado a um taxi'}, 401) if from_db.taxi.nil?

          present from_db, with: TaxiApp::Api::Entities::User
        end

        desc "Return directions for the given points", entity: TaxiApp::Api::Entities::Taxi
        get('/directions') do
          travel_time = TaxiApp::TravelTime.new
          estimative = travel_time.get_route(params[:origin].split(','), params[:destination].split(','))
          estimative['routes'][0]['overview_polyline']
        end
      end
    end
  end
end
